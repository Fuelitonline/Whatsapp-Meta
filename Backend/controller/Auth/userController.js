const axios = require('axios');
const User = require('../../model/Auth/userModel');
const { generateToken } = require('../../utils/jwt');

exports.embeddedLogin = async (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({
            success: false,
            error: 'Authorization code is required',
        });
    }

    try {
        console.log('🔵 Step 1: Exchanging code for access token...');

        // Step 1: Exchange code for System User Access Token
        const tokenUrl = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION || 'v19.0'}/oauth/access_token`;

        console.log('🔵 Token URL:', tokenUrl);
        console.log('🔵 Using App ID:', process.env.FACEBOOK_APP_ID);
        console.log('🔵 Code length:', code.length);

        const tokenResponse = await axios.get(tokenUrl, {
            params: {
                client_id: process.env.FACEBOOK_APP_ID,
                client_secret: process.env.FACEBOOK_APP_SECRET,
                code: code,
                redirect_uri: "https://www.facebook.com/connect/login_success.html",
            },
            timeout: 30000,
        });

        const systemUserAccessToken = tokenResponse.data.access_token;
        if (!systemUserAccessToken) {
            throw new Error('Failed to obtain access token');
        }
        console.log('✅ Step 1: Access token received');

        // Step 2: Get user + business accounts
        console.log('🔵 Step 2: Fetching user and business accounts...');
        const meResponse = await axios.get(
            `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION || 'v19.0'}/me`,
            {
                params: {
                    fields: 'id,name,email,accounts{id,name,access_token,whatsapp_business_accounts{id}}',
                    access_token: systemUserAccessToken,
                },
                timeout: 30000,
            }
        );

        const { id: facebookUserId, name, email, accounts } = meResponse.data;
        console.log('🔵 User data received:', { facebookUserId, name, email });

        if (!accounts?.data?.length) {
            return res.status(400).json({
                success: false,
                error: 'No Business Manager found. Please create one in Meta Business Suite.',
            });
        }

        const businessAccount = accounts.data[0];
        const waba = businessAccount.whatsapp_business_accounts?.data?.[0];
        if (!waba) {
            return res.status(400).json({
                success: false,
                error: 'WhatsApp Business Account not found. Please complete setup in Meta Business Manager.',
            });
        }
        console.log('✅ Step 2: Business account found -', businessAccount.name);
        console.log('🔵 WABA ID:', waba.id);

        // Step 3: Get Phone Number
        console.log('🔵 Step 3: Fetching phone numbers...');
        const phoneResponse = await axios.get(
            `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION || 'v19.0'}/${waba.id}/phone_numbers`,
            {
                params: {
                    access_token: systemUserAccessToken,
                },
                timeout: 30000,
            }
        );

        const phoneNumber = phoneResponse.data.data?.[0];
        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                error: 'No phone number connected. Please link a number in Meta Business Suite.',
            });
        }
        console.log('✅ Step 3: Phone number found -', phoneNumber.id);

        // Step 4: Auto-subscribe to webhooks
        console.log('🔵 Step 4: Subscribing to webhooks...');
        try {
            await axios.post(
                `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION || 'v19.0'}/${waba.id}/subscribed_apps`,
                {
                    subscribed_fields: ['messages', 'message_deliveries', 'message_reads', 'message_template_status_update'],
                },
                {
                    params: {
                        access_token: systemUserAccessToken,
                    },
                    timeout: 30000,
                }
            );
            console.log('✅ Step 4: Webhook subscription successful');
        } catch (webhookError) {
            console.log('⚠️ Webhook subscription note:', webhookError.response?.data?.error?.message || 'Already subscribed');
        }

        // Step 5: Save / Update User
        console.log('🔵 Step 5: Saving user data...');
        let user = await User.findOne({ facebookUserId });
        if (user) {
            user.name = name;
            user.email = email || user.email;
            user.businessName = businessAccount.name;
            user.waBusinessAccountId = waba.id;
            user.waPhoneNumberId = phoneNumber.id;
            user.waPhoneNumber = phoneNumber.display_phone_number || phoneNumber.phone_number;
            user.waAccessToken = systemUserAccessToken;
            user.lastLogin = new Date();
        } else {
            user = new User({
                facebookUserId,
                name,
                email: email || '',
                businessName: businessAccount.name,
                waBusinessAccountId: waba.id,
                waPhoneNumberId: phoneNumber.id,
                waPhoneNumber: phoneNumber.display_phone_number || phoneNumber.phone_number,
                waAccessToken: systemUserAccessToken,
                lastLogin: new Date(),
            });
        }
        await user.save();
        console.log('✅ Step 5: User data saved');

        // Step 6: Generate JWT
        console.log('🔵 Step 6: Generating JWT token...');
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
                waPhoneNumber: user.waPhoneNumber,
                hasCompletedOnboarding: true,
            },
        });
        console.log('✅ Step 6: Login process completed successfully');
    } catch (error) {
        console.error('❌ Embedded Login Error:', error.response?.data || error.message);

        let errorMessage = 'Login failed. Please try again.';

        if (error.response?.data?.error) {
            errorMessage = error.response.data.error.message || errorMessage;
        } else if (error.message.includes('access token')) {
            errorMessage = 'Invalid authorization code. Please try logging in again.';
        } else if (error.message.includes('Network')) {
            errorMessage = 'Network error. Please check your connection.';
        }

        res.status(500).json({
            success: false,
            error: errorMessage,
        });
    }
};
