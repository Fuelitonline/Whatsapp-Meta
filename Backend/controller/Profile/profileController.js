const User = require('../../model/Auth/userModel');

// Get Profile Data
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.userId; // Extracted from JWT middleware
        const user = await User.findById(userId).select('-waAccessToken -__v'); // Exclude sensitive fields

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Construct profile data matching frontend structure
        const profileData = {
            userProfile: {
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                profilePicture: user.profilePicture || null,
            },
            businessProfile: {
                businessName: user.businessName || '',
                logo: user.businessLogo || null,
                about: user.businessAbout || '',
                website: user.businessWebsite || '',
                address: user.businessAddress || '',
                workingHours: user.businessWorkingHours || '',
            },
            accountInfo: {
                accountId: user._id.toString(),
                wabaId: user.waBusinessAccountId,
                connectedNumbers: user.connectedNumbers || [],
                verificationStatus: user.verificationStatus || 'verified',
                lastLogin: user.lastLogin || new Date().toISOString(),
            },
            activeDevices: user.activeDevices || [],
        };

        res.status(200).json({ success: true, data: profileData });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch profile data' });
    }
};

// Update Profile Data
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId; // Extracted from JWT middleware
        const { userProfile, businessProfile } = req.body;

        // Validate input
        if (!userProfile && !businessProfile && !req.files) {
            return res.status(400).json({ success: false, error: 'No profile data or files provided' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Handle profile picture upload
        if (req.file && req.file.fieldname === 'profilePicture') {
            user.profilePicture = req.file.path; // Cloudinary URL from upload middleware
        }

        // Handle business logo upload
        if (req.file && req.file.fieldname === 'businessLogo') {
            user.businessLogo = req.file.path; // Cloudinary URL from upload middleware
        }

        // Update user profile fields
        if (userProfile) {
            user.name = userProfile.name || user.name;
            user.email = userProfile.email || user.email;
            user.phone = userProfile.phone || user.phone;
        }

        // Update business profile fields
        if (businessProfile) {
            user.businessName = businessProfile.businessName || user.businessName;
            user.businessAbout = businessProfile.about || user.businessAbout;
            user.businessWebsite = businessProfile.website || user.businessWebsite;
            user.businessAddress = businessProfile.address || user.businessAddress;
            user.businessWorkingHours = businessProfile.workingHours || user.businessWorkingHours;
        }

        await user.save();

        res.status(200).json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, error: 'Failed to update profile' });
    }
};

// Logout Device
exports.logoutDevice = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { deviceId } = req.body;

        if (!deviceId) {
            return res.status(400).json({ success: false, error: 'Device ID is required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Filter out the device
        user.activeDevices = user.activeDevices.filter(device => device.id !== deviceId);
        await user.save();

        res.status(200).json({ success: true, message: 'Device logged out successfully' });
    } catch (error) {
        console.error('Logout device error:', error);
        res.status(500).json({ success: false, error: 'Failed to logout device' });
    }
};