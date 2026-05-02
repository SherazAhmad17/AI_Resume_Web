import { useState, useEffect } from 'react';
import { UserApi } from '../api/UserApi';
import { useAuth } from '../hooks/authContext';

// Importing MUI components
import { Avatar, IconButton, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [passwordStatus, setPasswordStatus] = useState({ type: null, message: "" });
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState({ type: null, message: "" });
    const [activeTab, setActiveTab] = useState("personal"); // "personal" or "security"

    // Populate data when the component renders
    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setGender(user.gender ? user.gender.toLowerCase() : "");
            setPreviewUrl(user.profilePicture?.url || "");
        }
    }, [user]);

    // Password message auto-hide
    useEffect(() => {
        if (passwordStatus.message) {
            const timer = setTimeout(() => {
                setPasswordStatus({ type: null, message: "" });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [passwordStatus]);

    // NEW: Auto-hide the status message after 3 seconds
    useEffect(() => {
        if (status.message) {
            const timer = setTimeout(() => {
                setStatus({ type: null, message: "" });
            }, 3000); // 3000 milliseconds = 3 seconds

            // Cleanup function to clear the timer if the component unmounts 
            // or if a new message appears before the 3 seconds are up
            return () => clearTimeout(timer);
        }
    }, [status]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setStatus({ type: null, message: "" });

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("gender", gender);
            if (profilePicture) {
                formData.append("profilePicture", profilePicture);
            }

            const res = await UserApi.updateProfile(formData);
            if (res.data.success) {
                setStatus({ type: 'success', message: "Profile updated successfully!" });
                setUser(res.data.user);
                setProfilePicture(null);
            }
        } catch (error) {
            setStatus({ type: 'error', message: error?.response?.data?.message || "Failed to update profile. Please try again." });
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setIsSavingPassword(true);
        setPasswordStatus({ type: null, message: "" });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordStatus({ type: 'error', message: "New passwords do not match." });
            setIsSavingPassword(false);
            return;
        }

        try {
            const res = await UserApi.changePassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            if (res.data.success) {
                setPasswordStatus({ type: 'success', message: "Password changed successfully!" });
                setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
            }
        } catch (error) {
            setPasswordStatus({ type: 'error', message: error?.response?.data?.message || "Failed to change password." });
        } finally {
            setIsSavingPassword(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 font-['Outfit',sans-serif]">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-start">
                
                {/* Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 transition-all duration-300">
                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-5 px-3">Profile Settings</h3>
                        <nav className="space-y-1.5">
                            <button 
                                onClick={() => setActiveTab("personal")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === 'personal' ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-100' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <PersonIcon fontSize="small" />
                                Personal Info
                            </button>
                            <button 
                                onClick={() => setActiveTab("security")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === 'security' ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-100' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <SecurityIcon fontSize="small" />
                                Security
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {activeTab === 'personal' ? (
                        <>
                            {/* Cover Photo Area */}
                            <div className="h-32 bg-gradient-to-r from-[#D1E9FF] to-white w-full relative border-b border-blue-50"></div>

                            <div className="px-8 pb-8">
                                {/* Profile Picture Section */}
                                <div className="relative flex justify-between items-end -mt-12 mb-8">
                                    <div className="relative group">
                                        <Avatar
                                            src={previewUrl}
                                            alt={name}
                                            sx={{
                                                width: 100,
                                                height: 100,
                                                border: '4px solid white',
                                                backgroundColor: '#2563EB',
                                                fontSize: '2.5rem',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                            }}
                                        >
                                            {name ? name[0].toUpperCase() : "U"}
                                        </Avatar>

                                        <div className="absolute bottom-0 right-0 bg-white rounded-full shadow-md border border-gray-100 transition-transform group-hover:scale-105">
                                            <IconButton size="small" component="label" sx={{ color: '#2563EB' }}>
                                                <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                                                <PhotoCameraIcon fontSize="small" />
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>

                                {/* Header Section */}
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                                    <p className="text-sm text-gray-500 mt-1">Update your photo and personal details here to optimize your CV.</p>
                                </div>

                                {/* Form Section */}
                                <form onSubmit={handleUpdate} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                        {/* Name Input */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition-all text-gray-900"
                                                placeholder="e.g. John Smith"
                                                required
                                            />
                                        </div>

                                        {/* Email Input */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                value={user?.email || ""}
                                                disabled
                                                className="w-full border border-gray-200 px-4 py-2.5 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
                                            />
                                            <p className="text-xs text-gray-400 mt-1.5">Email cannot be changed.</p>
                                        </div>

                                        {/* Gender Input */}
                                        <div className="flex flex-col">
                                            <FormControl fullWidth variant="outlined">
                                                <InputLabel id="gender-label" sx={{ fontSize: "0.875rem" }}>Gender</InputLabel>
                                                <Select
                                                    labelId="gender-label"
                                                    value={gender}
                                                    onChange={(e) => setGender(e.target.value)}
                                                    label="Gender"
                                                    required
                                                    sx={{ borderRadius: '8px' }}
                                                >
                                                    <MenuItem value="male">Male</MenuItem>
                                                    <MenuItem value="female">Female</MenuItem>
                                                    <MenuItem value="other">Other</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </div>

                                    {/* Status Messages (Success/Error) */}
                                    <div className="min-h-[50px]">
                                        {status.message && (
                                            <div className={`p-4 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-300 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                                {status.type === 'success' ? <CheckCircleIcon fontSize="small" /> : <ErrorIcon fontSize="small" />}
                                                {status.message}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end pt-4 border-t border-gray-100">
                                        <button
                                            type="submit"
                                            disabled={isSaving || !name.trim()}
                                            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[150px] shadow-sm"
                                        >
                                            {isSaving ? <CircularProgress size={20} color="inherit" /> : "Save Changes"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="p-8">
                            {/* Password Section */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Security</h2>
                                <p className="text-sm text-gray-500 mt-1">Ensure your account is using a secure password.</p>
                            </div>
                            <form onSubmit={handleChangePassword} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                                        <input
                                            type="password"
                                            value={passwordData.oldPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition-all text-gray-900"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                            <input
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition-all text-gray-900"
                                                placeholder="••••••••"
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                                            <input
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition-all text-gray-900"
                                                placeholder="••••••••"
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Password Status Messages */}
                                <div className="min-h-[50px]">
                                    {passwordStatus.message && (
                                        <div className={`p-4 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-300 ${passwordStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                            {passwordStatus.type === 'success' ? <CheckCircleIcon fontSize="small" /> : <ErrorIcon fontSize="small" />}
                                            {passwordStatus.message}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end pt-4 border-t border-gray-100">
                                    <button
                                        type="submit"
                                        disabled={isSavingPassword || !passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                                        className="bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[150px] shadow-sm"
                                    >
                                        {isSavingPassword ? <CircularProgress size={20} color="inherit" /> : "Update Password"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;