import { useState, useEffect } from 'react';
import { UserApi } from '../api/UserApi';
import { useAuth } from '../hooks/authContext';

// Importing MUI components
import { Avatar, IconButton, CircularProgress } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [name, setName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState({ type: null, message: "" });

    // Populate data when the component renders
    useEffect(() => {
        if (user) {
            setName(user.name || "");
        }
    }, [user]);

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

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setStatus({ type: null, message: "" });

        try {
            const res = await UserApi.updateProfile({ name });
            if (res.data.success) {
                setStatus({ type: 'success', message: "Profile updated successfully!" });
                setUser(res.data.user);
            }
        } catch (error) {
            setStatus({ type: 'error', message: "Failed to update profile. Please try again." });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8 font-['Inter']">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Cover Photo Area */}
                <div className="h-32 bg-gradient-to-r from-[#D1E9FF] to-white w-full relative border-b border-blue-50"></div>

                <div className="px-8 pb-8">
                    {/* Profile Picture Section */}
                    <div className="relative flex justify-between items-end -mt-12 mb-8">
                        <div className="relative group">
                            <Avatar
                                src={user?.avatarUrl || ""}
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
                                    <input hidden accept="image/*" type="file" />
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
                        </div>

                        {/* Status Messages (Success/Error) */}
                        <div className="min-h-[50px]">
                            {/* The min-h prevents the save button from jumping up and down when the message disappears */}
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
            </div>
        </div>
    );
};

export default Profile;