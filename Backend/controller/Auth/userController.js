const axios = require('axios');
const User = require('../../model/Auth/userModel');
const { generateToken } = require('../../utils/jwt');

exports.embeddedLogin = async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({
            success: false,
            error: 'Authorization code is required'
        });
    }

    try {
        // Step 1: Exchange code for System User Access Token
        const tokenUrl = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/oauth/access_token`;
        const tokenResponse = await axios.get(tokenUrl, {
            params: {
                client_id: process.env.FACEBOOK_APP_ID,
                client_secret: process.env.FACEBOOK_APP_SECRET,
                code,
            }
        });

        const systemUserAccessToken = tokenResponse.data.access_token;
        if (!systemUserAccessToken) {
            throw new Error('Failed to obtain access token');
        }

        // Step 2: Get user + business accounts
        const meResponse = await axios.get(
            `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/me`,
            {
                params: {
                    fields: 'id,name,email,accounts{whatsapp_business_accounts}',
                    access_token: systemUserAccessToken
                }
            }
        );

        const { id: facebookUserId, name, email, accounts } = meResponse.data;

        if (!accounts?.data?.length) {
            return res.status(400).json({
                success: false,
                error: 'No Business Manager found. Please create one.'
            });
        }

        const businessAccount = accounts.data[0];
        const waba = businessAccount.whatsapp_business_accounts?.data?.[0];

        if (!waba) {
            return res.status(400).json({
                success: false,
                error: 'WhatsApp Business Account not found. Please complete setup in Meta.'
            });
        }

        // Step 3: Get Phone Number
        const phoneResponse = await axios.get(
            `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${waba.id}/phone_numbers`,
            { params: { access_token: systemUserAccessToken } }
        );

        const phoneNumber = phoneResponse.data.data?.[0];
        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                error: 'No phone number connected. Please link a number in Meta Business Suite.'
            });
        }

        // Step 4: Auto-subscribe to webhooks
        try {
            await axios.post(
                `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${waba.id}/subscribed_apps`,
                {
                    subscribed_fields: ['messages', 'message_statuses', 'message_template_status_update']
                },
                {
                    headers: { Authorization: `Bearer ${systemUserAccessToken}` }
                }
            );
        } catch (e) {
            console.log("Webhook already subscribed or minor error (safe to ignore)");
        }

        // Step 5: Save / Update User
        let user = await User.findOne({ facebookUserId });

        if (user) {
            user.name = name;
            user.email = email;
            user.businessName = businessAccount.name;
            user.waBusinessAccountId = waba.id;
            user.waPhoneNumberId = phoneNumber.id;
            user.waAccessToken = systemUserAccessToken;
        } else {
            user = new User({
                facebookUserId,
                name,
                email,
                businessName: businessAccount.name,
                waBusinessAccountId: waba.id,
                waPhoneNumberId: phoneNumber.id,
                waAccessToken: systemUserAccessToken
            });
        }

        await user.save();

        // Step 6: Generate JWT
        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                businessName: user.businessName,
                waBusinessAccountId: user.waBusinessAccountId,
                waPhoneNumberId: user.waPhoneNumberId,
                hasCompletedOnboarding: true
            }
        });

    } catch (error) {
        console.error('Embedded Login Error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: error.response?.data?.error?.message || 'Login failed. Please try again.'
        });
    }
};