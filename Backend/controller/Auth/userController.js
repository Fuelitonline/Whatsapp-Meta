const axios = require('axios');
const { generateToken } = require('../../utils/jwt');
const User = require('../../model/Auth/userModel');

exports.login = async (req, res) => {
    try {
        const { code, accessToken } = req.body;
        if (!code && !accessToken) {
            return res.status(400).json({ success: false, error: 'No code or access token provided' });
        }

        let access_token, expires_in;

        if (code) {
            // Exchange code for access token (existing flow)
            const tokenResponse = await axios.get(
                `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/oauth/access_token`,
                {
                    params: {
                        client_id: process.env.FACEBOOK_APP_ID,
                        client_secret: process.env.FACEBOOK_APP_SECRET,
                        code,
                        redirect_uri: process.env.REDIRECT_URI,
                    },
                }
            );
            ({ access_token, expires_in } = tokenResponse.data);
        } else if (accessToken) {
            // Use provided access token (from FB.getLoginStatus)
            access_token = accessToken;
            // Fetch token expiration (optional, as expiresIn may be provided by FB.getLoginStatus)
            const debugResponse = await axios.get(
                `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/debug_token`,
                {
                    params: {
                        input_token: accessToken,
                        access_token: `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`,
                    },
                }
            );
            expires_in = debugResponse.data.data.expires_at;
        }

        // Fetch WABA and phone number details
        const meResponse = await axios.get(
            `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/me`,
            {
                params: {
                    fields: 'id,email,name,whatsapp_business_accounts',
                    access_token,
                },
            }
        );

        const { id, email, name, whatsapp_business_accounts } = meResponse.data;
        if (!whatsapp_business_accounts?.data?.length) {
            return res.status(400).json({ success: false, error: 'No WhatsApp Business Account found' });
        }

        const waba = whatsapp_business_accounts.data[0];
        const wabaId = waba.id;

        // Fetch phone numbers
        const phoneResponse = await axios.get(
            `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${wabaId}/phone_numbers`,
            {
                headers: { Authorization: `Bearer ${access_token}` },
            }
        );

        const phoneNumber = phoneResponse.data.data[0];
        if (!phoneNumber) {
            return res.status(400).json({ success: false, error: 'No phone number found' });
        }

        const phoneNumberId = phoneNumber.id;

        // Check if phone number is registered
        if (phoneNumber.status !== 'connected') {
            await axios.post(
                `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${phoneNumberId}/register`,
                { messaging_product: 'whatsapp' },
                { headers: { Authorization: `Bearer ${access_token}` } }
            );
        }

        // Subscribe to webhooks on WABA
        await axios.post(
            `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${wabaId}/subscribed_apps`,
            {
                subscribed_fields: ['messages', 'message_template_status_update', 'statuses'],
            },
            {
                headers: { Authorization: `Bearer ${access_token}` },
            }
        );

        // Save or update user
        let user = await User.findOne({ email });
        if (user) {
            user.waPhoneNumberId = phoneNumberId;
            user.waBusinessAccountId = wabaId;
            user.waAccessToken = access_token;
            user.tokenExpiresAt = expires_in ? new Date(expires_in * 1000) : null;
            await user.save();
        } else {
            user = new User({
                name,
                email,
                waPhoneNumberId: phoneNumberId,
                waBusinessAccountId: wabaId,
                waAccessToken: access_token,
                tokenExpiresAt: expires_in ? new Date(expires_in * 1000) : null,
            });
            await user.save();
        }

        // Generate JWT
        const token = generateToken(user._id);

        res.status(200).json({ success: true, token, user });
    } catch (error) {
        console.error('Login error:', error);
        const errorMessage = error.response?.data?.error?.message || 'Failed to authenticate';
        const errorCode = error.response?.data?.error?.code;
        let userMessage = errorMessage;
        if (errorCode === 'invalid_code') {
            userMessage = 'Invalid or expired authorization code. Please try logging in again.';
        }
        res.status(500).json({ success: false, error: userMessage });
    }
};