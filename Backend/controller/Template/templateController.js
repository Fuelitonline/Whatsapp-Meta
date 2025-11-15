const axios = require('axios');
const Template = require('../../model/Template/templateModel');
const User = require('../../model/Auth/userModel');

const validateTemplateName = (name) => /^[a-z0-9_]+$/.test(name);

const validateTTL = (ttl, category) => {
    if (ttl === -1) return true; // Default 30 days
    if (category === 'AUTHENTICATION' && (ttl < 30 || ttl > 900)) return false;
    if (category === 'UTILITY' && (ttl < 30 || ttl > 43200)) return false;
    if (category === 'MARKETING' && (ttl < 43200 || ttl > 2592000)) return false;
    return true;
};

const categoryTypeMap = {
    MARKETING: ['CUSTOM', 'CATALOG', 'FLOW'],
    UTILITY: ['CUSTOM', 'FLOW'],
    AUTHENTICATION: ['AUTHENTICATION'],
};

exports.saveAndSubmitTemplate = async (req, res) => {
    try {
        const {
            id,
            name,
            language,
            category,
            templateType = 'CUSTOM',
            components,
            sampleValues,
            submitToWhatsApp,
            flowId,
            flowButtonText,
            otpButtonType,
            otpExpiry,
            catalogId,
            message_send_ttl_seconds = -1,
            libraryTemplateName,
            libraryTemplateButtonInputs,
            libraryTemplateBodyInputs,
        } = req.body;

        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        if (!validateTemplateName(name)) {
            return res.status(400).json({ success: false, error: 'Template name must be lowercase, alphanumeric, and may include underscores only.' });
        }

        if (!categoryTypeMap[category]?.includes(templateType)) {
            return res.status(400).json({ success: false, error: `Invalid template type '${templateType}' for category '${category}'. Allowed: ${categoryTypeMap[category].join(', ')}` });
        }

        if (!components?.body?.text) {
            return res.status(400).json({ success: false, error: 'Body text is required.' });
        }

        if (!validateTTL(message_send_ttl_seconds, category)) {
            return res.status(400).json({ success: false, error: `Invalid TTL for ${category}. Check min/max values in documentation.` });
        }

        if (templateType === 'FLOW') {
            if (!flowId) return res.status(400).json({ success: false, error: 'Flow ID is required when Flow is enabled.' });
            if (!flowButtonText) return res.status(400).json({ success: false, error: 'Flow button text is required when Flow is enabled.' });
            if (components.buttons?.length > 0) return res.status(400).json({ success: false, error: 'Other buttons cannot be included when a Flow is enabled.' });
        }
        if (templateType === 'CATALOG') {
            if (!catalogId) return res.status(400).json({ success: false, error: 'Catalog ID is required for Catalog templates.' });
            if (components.buttons?.length > 0) return res.status(400).json({ success: false, error: 'Other buttons cannot be included when Catalog is enabled.' });
        }
        if (templateType === 'AUTHENTICATION') {
            if (!otpExpiry) return res.status(400).json({ success: false, error: 'OTP expiry time is required for Authentication templates.' });
            if (!['COPY_CODE', 'ONE_TAP'].includes(otpButtonType)) return res.status(400).json({ success: false, error: 'Invalid OTP button type. Must be COPY_CODE or ONE_TAP.' });
            if (components.buttons?.length > 1) return res.status(400).json({ success: false, error: 'Only one OTP button allowed for Authentication.' });
            if (components.body.text.match(/(\*|\_|\~)/)) return res.status(400).json({ success: false, error: 'Formatting not allowed in Authentication body.' });
        }

        let headerUrl = components.header?.url;
        if (req.file) {
            const validMimeTypes = {
                IMAGE: ['image/jpeg', 'image/png'],
                VIDEO: ['video/mp4', 'video/3gpp'],
                DOCUMENT: ['application/pdf'],
            };
            const format = components.header?.format;
            if (format && !validMimeTypes[format]?.includes(req.file.mimetype)) {
                return res.status(400).json({ success: false, error: `Invalid file type for ${format}. Allowed: ${validMimeTypes[format].join(', ')}` });
            }
            headerUrl = req.file.path;
        }
        if (components.header && ['IMAGE', 'DOCUMENT', 'VIDEO'].includes(components.header.format) && !headerUrl) {
            return res.status(400).json({ success: false, error: 'Please upload a file for the selected header type.' });
        }

        const query = { name, language };
        if (id) query._id = { $ne: id };
        const existing = await Template.findOne(query);
        if (existing) return res.status(400).json({ success: false, error: 'Template name already exists for this language.' });

        const templateData = {
            userId,
            name,
            language,
            category,
            templateType,
            components: {
                header: components.header ? { ...components.header, url: headerUrl } : undefined,
                body: { ...components.body, expiry: templateType === 'AUTHENTICATION' ? otpExpiry : undefined },
                footer: components.footer,
                buttons: components.buttons,
                flow: templateType === 'FLOW' ? { id: flowId, buttonText: flowButtonText } : undefined,
                catalog: templateType === 'CATALOG' ? { id: catalogId } : undefined,
            },
            sampleValues,
            message_send_ttl_seconds,
        };

        let template;
        if (id) {
            template = await Template.findByIdAndUpdate(id, templateData, { new: true });
        } else {
            template = new Template(templateData);
            await template.save();
        }

        if (submitToWhatsApp) {
            let headerHandle = null;
            if (components.header && components.header.format !== 'TEXT' && headerUrl) {
                const fileResponse = await axios.get(headerUrl, { responseType: 'arraybuffer' });
                const mimeType = req.file?.mimetype || (components.header.format === 'IMAGE' ? 'image/jpeg' : components.header.format === 'VIDEO' ? 'video/mp4' : 'application/pdf');
                const uploadSession = await axios.post(
                    `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${user.waPhoneNumberId}/media`,
                    { file_length: fileResponse.data.length, file_type: mimeType },
                    { headers: { Authorization: `Bearer ${user.waAccessToken}` } }
                );
                const uploadResponse = await axios.post(
                    uploadSession.data.upload_url,
                    fileResponse.data,
                    { headers: { Authorization: `OAuth ${user.waAccessToken}`, 'Content-Type': mimeType } }
                );
                headerHandle = uploadResponse.data.h;
            }

            const waComponents = [];
            if (components.header) {
                const headerVars = components.header.format === 'TEXT' ? components.header.text.match(/{{\d+}}/g) || [] : [];
                waComponents.push({
                    type: 'HEADER',
                    format: components.header.format,
                    ...(components.header.format === 'TEXT'
                        ? { text: components.header.text, ...(headerVars.length && { example: { header_text: headerVars.map(v => sampleValues[v] || 'sample') } }) }
                        : { example: { header_handle: [headerHandle] } }),
                });
            }
            const bodyVars = components.body.text.match(/{{\d+}}/g) || [];
            waComponents.push({
                type: 'BODY',
                text: components.body.text,
                ...(bodyVars.length && { example: { body_text: [bodyVars.map(v => sampleValues[v] || 'sample')] } }),
                ...(templateType === 'AUTHENTICATION' && { code_expiration_minutes: otpExpiry }),
            });
            if (components.footer) {
                waComponents.push({ type: 'FOOTER', text: components.footer.text });
            }

            if (templateType === 'CUSTOM' && components.buttons?.length > 0) {
                waComponents.push({
                    type: 'BUTTONS',
                    buttons: components.buttons.map(button => ({
                        type: button.type,
                        text: button.text,
                        ...(button.type === 'URL' && { url: button.url }),
                        ...(button.type === 'PHONE_NUMBER' && { phone_number: button.phone_number }),
                    })),
                });
            } else if (templateType === 'FLOW') {
                waComponents.push({
                    type: 'BUTTONS',
                    buttons: [{ type: 'FLOW', text: flowButtonText, flow_id: flowId }],
                });
            } else if (templateType === 'CATALOG') {
                waComponents.push({
                    type: 'BUTTONS',
                    buttons: [{ type: 'CATALOG', text: 'View Catalog' }],
                });
            } else if (templateType === 'AUTHENTICATION') {
                waComponents.push({
                    type: 'BUTTONS',
                    buttons: [{
                        type: 'OTP',
                        otp_type: otpButtonType === 'COPY_CODE' ? 'COPY_CODE' : 'ONE_TAP',
                        text: otpButtonType === 'COPY_CODE' ? 'Copy Code' : 'Autofill',
                    }],
                });
            }

            const waPayload = {
                name: template.name,
                language: template.language,
                category: template.category,
                components: waComponents,
                message_send_ttl_seconds: template.message_send_ttl_seconds,
                ...(libraryTemplateName && { library_template_name: libraryTemplateName }),
                ...(libraryTemplateButtonInputs && { library_template_button_inputs: libraryTemplateButtonInputs }),
                ...(libraryTemplateBodyInputs && { library_template_body_inputs: libraryTemplateBodyInputs }),
            };

            const response = await axios.post(
                `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${user.waBusinessAccountId}/message_templates`,
                waPayload,
                { headers: { Authorization: `Bearer ${user.waAccessToken}`, 'Content-Type': 'application/json' } }
            );

            template.waTemplateId = response.data.id;
            template.status = response.data.status || 'PENDING';
            template.category = response.data.category;
            await template.save();
        }

        res.status(200).json({ success: true, data: template });
    } catch (error) {
        console.error('Save and submit template error:', error);
        const errorMessage = error.response?.data?.error?.message || 'Failed to save and submit template.';
        const errorCode = error.response?.data?.error?.code || error.response?.data?.error?.error_data?.details;
        let userMessage = errorMessage;
        if (errorCode === 'TAG_CONTENT_MISMATCH') {
            userMessage = 'Template category does not match content. Consider changing to MARKETING.';
        } else if (errorCode === 'INVALID_PARAMETER') {
            userMessage = 'Invalid template parameters. Check component formats or variable examples.';
        } else if (errorCode === 'RATE_LIMIT_EXCEEDED') {
            userMessage = 'Template creation rate limit exceeded (100/hour). Try again later.';
        } else if (errorMessage.includes('structure unavailable')) {
            userMessage = 'Template structure invalid. Ensure consistent translations or check localization.';
        }
        res.status(500).json({ success: false, error: userMessage });
    }
};

exports.updateTemplate = async (req, res) => {
    try {
        const {
            name,
            language,
            category,
            templateType = 'CUSTOM',
            components,
            sampleValues,
            submitToWhatsApp,
            flowId,
            flowButtonText,
            otpButtonType,
            otpExpiry,
            catalogId,
            message_send_ttl_seconds = -1,
        } = req.body;

        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        if (!validateTemplateName(name)) {
            return res.status(400).json({ success: false, error: 'Template name must be lowercase, alphanumeric, and may include underscores only.' });
        }
        if (!categoryTypeMap[category]?.includes(templateType)) {
            return res.status(400).json({ success: false, error: `Invalid template type '${templateType}' for category '${category}'. Allowed: ${categoryTypeMap[category].join(', ')}` });
        }
        if (!components?.body?.text) {
            return res.status(400).json({ success: false, error: 'Body text is required.' });
        }
        if (!validateTTL(message_send_ttl_seconds, category)) {
            return res.status(400).json({ success: false, error: `Invalid TTL for ${category}. Check min/max values in documentation.` });
        }
        if (templateType === 'FLOW') {
            if (!flowId) return res.status(400).json({ success: false, error: 'Flow ID is required when Flow is enabled.' });
            if (!flowButtonText) return res.status(400).json({ success: false, error: 'Flow button text is required when Flow is enabled.' });
            if (components.buttons?.length > 0) return res.status(400).json({ success: false, error: 'Other buttons cannot be included when a Flow is enabled.' });
        }
        if (templateType === 'CATALOG') {
            if (!catalogId) return res.status(400).json({ success: false, error: 'Catalog ID is required for Catalog templates.' });
            if (components.buttons?.length > 0) return res.status(400).json({ success: false, error: 'Other buttons cannot be included when Catalog is enabled.' });
        }
        if (templateType === 'AUTHENTICATION') {
            if (!otpExpiry) return res.status(400).json({ success: false, error: 'OTP expiry time is required for Authentication templates.' });
            if (!['COPY_CODE', 'ONE_TAP'].includes(otpButtonType)) return res.status(400).json({ success: false, error: 'Invalid OTP button type. Must be COPY_CODE or ONE_TAP.' });
            if (components.buttons?.length > 1) return res.status(400).json({ success: false, error: 'Only one OTP button allowed for Authentication.' });
            if (components.body.text.match(/(\*|\_|\~)/)) return res.status(400).json({ success: false, error: 'Formatting not allowed in Authentication body.' });
        }

        let headerUrl = components.header?.url;
        if (req.file) {
            const validMimeTypes = {
                IMAGE: ['image/jpeg', 'image/png'],
                VIDEO: ['video/mp4', 'video/3gpp'],
                DOCUMENT: ['application/pdf'],
            };
            const format = components.header?.format;
            if (format && !validMimeTypes[format]?.includes(req.file.mimetype)) {
                return res.status(400).json({ success: false, error: `Invalid file type for ${format}. Allowed: ${validMimeTypes[format].join(', ')}` });
            }
            headerUrl = req.file.path;
        }
        if (components.header && ['IMAGE', 'DOCUMENT', 'VIDEO'].includes(components.header.format) && !headerUrl) {
            return res.status(400).json({ success: false, error: 'Please upload a file for the selected header type.' });
        }

        const templateData = {
            name,
            language,
            category,
            templateType,
            components: {
                header: components.header ? { ...components.header, url: headerUrl } : undefined,
                body: { ...components.body, expiry: templateType === 'AUTHENTICATION' ? otpExpiry : undefined },
                footer: components.footer,
                buttons: components.buttons,
                flow: templateType === 'FLOW' ? { id: flowId, buttonText: flowButtonText } : undefined,
                catalog: templateType === 'CATALOG' ? { id: catalogId } : undefined,
            },
            sampleValues,
            message_send_ttl_seconds,
        };

        const template = await Template.findByIdAndUpdate(req.params.id, templateData, { new: true });
        if (!template) return res.status(404).json({ success: false, error: 'Template not found' });

        if (submitToWhatsApp) {
            const waPayload = {};
            if (category !== template.category) waPayload.category = category;
            const waComponents = [];
            if (components.header) {
                const headerVars = components.header.format === 'TEXT' ? components.header.text.match(/{{\d+}}/g) || [] : [];
                waComponents.push({
                    type: 'HEADER',
                    format: components.header.format,
                    ...(components.header.format === 'TEXT'
                        ? { text: components.header.text, ...(headerVars.length && { example: { header_text: headerVars.map(v => sampleValues[v] || 'sample') } }) }
                        : { example: { header_handle: [headerHandle] } }),
                });
            }
            const bodyVars = components.body.text.match(/{{\d+}}/g) || [];
            waComponents.push({
                type: 'BODY',
                text: components.body.text,
                ...(bodyVars.length && { example: { body_text: [bodyVars.map(v => sampleValues[v] || 'sample')] } }),
                ...(templateType === 'AUTHENTICATION' && { code_expiration_minutes: otpExpiry }),
            });
            if (components.footer) {
                waComponents.push({ type: 'FOOTER', text: components.footer.text });
            }

            if (templateType === 'CUSTOM' && components.buttons?.length > 0) {
                waComponents.push({
                    type: 'BUTTONS',
                    buttons: components.buttons.map(button => ({
                        type: button.type,
                        text: button.text,
                        ...(button.type === 'URL' && { url: button.url }),
                        ...(button.type === 'PHONE_NUMBER' && { phone_number: button.phone_number }),
                    })),
                });
            } else if (templateType === 'FLOW') {
                waComponents.push({
                    type: 'BUTTONS',
                    buttons: [{ type: 'FLOW', text: flowButtonText, flow_id: flowId }],
                });
            } else if (templateType === 'CATALOG') {
                waComponents.push({
                    type: 'BUTTONS',
                    buttons: [{ type: 'CATALOG', text: 'View Catalog' }],
                });
            } else if (templateType === 'AUTHENTICATION') {
                waComponents.push({
                    type: 'BUTTONS',
                    buttons: [{
                        type: 'OTP',
                        otp_type: otpButtonType === 'COPY_CODE' ? 'COPY_CODE' : 'ONE_TAP',
                        text: otpButtonType === 'COPY_CODE' ? 'Copy Code' : 'Autofill',
                    }],
                });
            }

            if (waComponents.length) waPayload.components = waComponents;

            const response = await axios.post(
                `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${template.waTemplateId}`,
                waPayload,
                { headers: { Authorization: `Bearer ${user.waAccessToken}`, 'Content-Type': 'application/json' } }
            );

            template.status = 'PENDING';
            await template.save();
        }

        res.status(200).json({ success: true, data: template });
    } catch (error) {
        console.error('Update template error:', error);
        const errorMessage = error.response?.data?.error?.message || 'Failed to update template.';
        const errorCode = error.response?.data?.error?.code || error.response?.data?.error?.error_data?.details;
        let userMessage = errorMessage;
        if (errorCode === 'TAG_CONTENT_MISMATCH') {
            userMessage = 'Template category does not match content. Consider changing to MARKETING.';
        } else if (errorCode === 'INVALID_PARAMETER') {
            userMessage = 'Invalid template parameters. Check component formats or variable examples.';
        } else if (errorCode === 'RATE_LIMIT_EXCEEDED') {
            userMessage = 'Template update rate limit exceeded (10/month or 1/day for approved). Try again later.';
        } else if (errorMessage.includes('structure unavailable')) {
            userMessage = 'Template structure invalid. Ensure consistent translations or check localization.';
        }
        res.status(500).json({ success: false, error: userMessage });
    }
};

exports.getTemplates = async (req, res) => {
    try {
        const userId = req.user._id;
        const { page = 1, limit = 10, status, category, search } = req.query;
        const query = { userId };
        if (status) query.status = status;
        if (category) query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' };

        await exports.syncTemplatesInternal(req.user);

        const templates = await Template.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Template.countDocuments(query);

        res.status(200).json({ success: true, data: templates, total, page: Number(page), limit: Number(limit) });
    } catch (error) {
        console.error('Get templates error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch templates.' });
    }
};

exports.syncTemplates = async (req, res) => {
    try {
        await exports.syncTemplatesInternal(req.user);
        res.status(200).json({ success: true, message: 'Templates synced successfully' });
    } catch (error) {
        console.error('Sync templates error:', error);
        res.status(500).json({ success: false, error: 'Failed to sync templates.' });
    }
};

exports.syncTemplatesInternal = async (user) => {
    if (user.waBusinessAccountId && user.waAccessToken) {
        const response = await axios.get(
            `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${user.waBusinessAccountId}/message_templates?fields=id,name,status,category,language,components,rejected_reason,quality_score,created_at`,
            { headers: { Authorization: `Bearer ${user.waAccessToken}` } }
        );
        const waTemplates = response.data.data;
        for (const waTemplate of waTemplates) {
            let localComponents = {
                header: undefined,
                body: { text: '' },
                footer: undefined,
                buttons: [],
                flow: undefined,
                catalog: undefined,
            };
            let sampleValues = {};
            let templateType = 'CUSTOM';
            let message_send_ttl_seconds = -1;

            waTemplate.components.forEach(comp => {
                if (comp.type === 'HEADER') {
                    localComponents.header = {
                        format: comp.format,
                        text: comp.text || '',
                        url: comp.example?.header_handle?.[0] ? `media://${comp.example.header_handle[0]}` : '',
                    };
                    if (comp.example?.header_text) {
                        comp.example.header_text.forEach((val, i) => sampleValues[`{{${i + 1}}}`] = val);
                    }
                } else if (comp.type === 'BODY') {
                    localComponents.body = {
                        text: comp.text,
                        expiry: comp.code_expiration_minutes,
                    };
                    if (comp.example?.body_text?.[0]) {
                        comp.example.body_text[0].forEach((val, i) => sampleValues[`{{${i + 1}}}`] = val);
                    }
                    message_send_ttl_seconds = comp.message_send_ttl_seconds || -1;
                } else if (comp.type === 'FOOTER') {
                    localComponents.footer = { text: comp.text };
                } else if (comp.type === 'BUTTONS') {
                    localComponents.buttons = comp.buttons.map(btn => ({
                        type: btn.type,
                        sub_type: btn.otp_type || btn.sub_type,
                        text: btn.text,
                        url: btn.url,
                        phone_number: btn.phone_number,
                        flow_id: btn.flow_id,
                    }));

                    if (comp.buttons.some(btn => btn.type === 'FLOW')) {
                        templateType = 'FLOW';
                        localComponents.flow = {
                            id: comp.buttons[0].flow_id,
                            buttonText: comp.buttons[0].text,
                        };
                    } else if (comp.buttons.some(btn => btn.type === 'CATALOG')) {
                        templateType = 'CATALOG';
                        localComponents.catalog = { id: comp.buttons[0].catalog_id || '' };
                    } else if (comp.buttons.some(btn => btn.type === 'OTP')) {
                        templateType = 'AUTHENTICATION';
                    }
                }
            });

            await Template.findOneAndUpdate(
                { userId: user._id, name: waTemplate.name, language: waTemplate.language },
                {
                    waTemplateId: waTemplate.id,
                    status: waTemplate.status,
                    rejectionReason: waTemplate.rejected_reason || '',
                    category: waTemplate.category,
                    templateType,
                    components: localComponents,
                    sampleValues,
                    message_send_ttl_seconds,
                    createdAt: waTemplate.created_at ? new Date(waTemplate.created_at) : new Date(),
                },
                { upsert: true, new: true }
            );
        }
    }
};

exports.getTemplateById = async (req, res) => {
    try {
        const template = await Template.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!template) {
            return res.status(404).json({ success: false, error: 'Template not found' });
        }
        res.status(200).json({ success: true, data: template });
    } catch (error) {
        console.error('Get template by ID error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch template.' });
    }
};

exports.deleteTemplate = async (req, res) => {
    try {
        const template = await Template.findOne({ _id: req.params.id, userId: req.user._id });
        if (!template) {
            return res.status(404).json({ success: false, error: 'Template not found' });
        }

        if (template.waTemplateId) {
            const user = await User.findById(req.user._id);
            await axios.delete(
                `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${user.waBusinessAccountId}/message_templates?name=${template.name}&language=${template.language}`,
                {
                    headers: { Authorization: `Bearer ${user.waAccessToken}` },
                }
            );
        }

        await Template.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Template deleted successfully' });
    } catch (error) {
        console.error('Delete template error:', error);
        res.status(500).json({ success: false, error: 'Failed to delete template.' });
    }
};