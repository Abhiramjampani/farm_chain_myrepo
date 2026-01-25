'use client';
import { useState, useEffect } from 'react';
import FarmerLayout from '@/components/farmer/FarmerLayout';
import { User, CreditCard, Bell, Save, Loader2, AlertCircle, Mail, Phone, Globe } from 'lucide-react';
import { graphqlRequest } from '@/lib/apollo-client';
import {
    GET_MY_PROFILE,
    UPDATE_USER_PROFILE,
    UPDATE_USER_BANK_DETAILS,
    UPDATE_USER_NOTIFICATION_SETTINGS,
    CREATE_USER_PROFILE
} from '@/lib/graphql/profile';
import { useAuth } from '@/context/AuthContext';

export default function Profile() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [profileExists, setProfileExists] = useState(false);

    // Form States
    const [generalData, setGeneralData] = useState({
        name: '',
        phoneNumber: '',
        languagePreference: 'ENGLISH',
    });

    const [bankData, setBankData] = useState({
        accountHolderName: '',
        bankAccountNumber: '',
        ifscCode: '',
        upiId: ''
    });

    const [notificationData, setNotificationData] = useState({
        orderAlerts: true,
        paymentAlerts: true,
        bidUpdates: true,
        weatherAlerts: true
    });

    useEffect(() => {
        if (!user) return; // Wait for auth
        fetchProfile();
    }, [user]);

    const fetchProfile = async () => {
        try {
            setLoading(true);

            // First, pre-fill from auth user data
            if (user) {
                setGeneralData(prev => ({
                    ...prev,
                    name: user.name || '',
                    phoneNumber: user.phone || '',
                }));
            }

            // Then try to fetch profile data
            const data = await graphqlRequest(GET_MY_PROFILE);
            const profile = data.getMyProfile;

            if (profile) {
                setProfileExists(true);
                setGeneralData({
                    name: profile.name || user?.name || '',
                    phoneNumber: profile.phoneNumber || user?.phone || '',
                    languagePreference: profile.languagePreference || 'ENGLISH',
                });
                if (profile.bankDetails) {
                    setBankData({
                        accountHolderName: profile.bankDetails.accountHolderName || '',
                        bankAccountNumber: profile.bankDetails.bankAccountNumber || '',
                        ifscCode: profile.bankDetails.ifscCode || '',
                        upiId: profile.bankDetails.upiId || ''
                    });
                }
                if (profile.notificationSettings) {
                    setNotificationData({
                        orderAlerts: profile.notificationSettings.orderAlerts ?? true,
                        paymentAlerts: profile.notificationSettings.paymentAlerts ?? true,
                        bidUpdates: profile.notificationSettings.bidUpdates ?? true,
                        weatherAlerts: profile.notificationSettings.weatherAlerts ?? true
                    });
                }
            } else {
                // No profile exists yet, use auth user data
                setProfileExists(false);
                if (user) {
                    setGeneralData({
                        name: user.name || '',
                        phoneNumber: user.phone || '',
                        languagePreference: 'ENGLISH',
                    });
                }
            }
        } catch (err) {
            console.error("Error fetching profile:", err);
            // If fetch fails, still use auth user data
            if (user) {
                setGeneralData({
                    name: user.name || '',
                    phoneNumber: user.phone || '',
                    languagePreference: 'ENGLISH',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSaveGeneral = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccessMessage('');

            const input = {
                name: generalData.name,
                phoneNumber: generalData.phoneNumber,
                languagePreference: generalData.languagePreference
            };

            if (!profileExists) {
                if (!user?.id) throw new Error("User ID not found");

                await graphqlRequest(CREATE_USER_PROFILE, {
                    input: {
                        ...input,
                        user: user.id
                    }
                });
                setProfileExists(true);
            } else {
                await graphqlRequest(UPDATE_USER_PROFILE, { input });
            }
            setSuccessMessage("Profile saved successfully!");
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.message || "Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    const handleSaveBank = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccessMessage('');
            await graphqlRequest(UPDATE_USER_BANK_DETAILS, { input: bankData });
            setSuccessMessage("Bank details saved successfully!");
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.message || "Failed to save bank details");
        } finally {
            setSaving(false);
        }
    };

    const handleSaveNotifications = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccessMessage('');
            await graphqlRequest(UPDATE_USER_NOTIFICATION_SETTINGS, { input: notificationData });
            setSuccessMessage("Notification preferences saved!");
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.message || "Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <FarmerLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
            </FarmerLayout>
        );
    }

    return (
        <FarmerLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Profile & Settings</h1>
                        <p className="text-slate-500">Manage your account information and preferences</p>
                    </div>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 border border-red-100">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl flex items-center gap-2 border border-emerald-100">
                        <Save className="w-5 h-5" />
                        {successMessage}
                    </div>
                )}

                {/* Account Information (Read-only from Auth) */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">Account Information</h2>
                            <p className="text-sm text-slate-500">Your login credentials (read-only)</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                            <Mail className="w-5 h-5 text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Email</p>
                                <p className="text-slate-900 font-medium">{user?.email || 'Not provided'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                            <Phone className="w-5 h-5 text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Phone</p>
                                <p className="text-slate-900 font-medium">{user?.phone || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Details Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <User className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">Personal Details</h2>
                            <p className="text-sm text-slate-500">Update your profile information</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Full Name</label>
                            <input
                                type="text"
                                value={generalData.name}
                                onChange={(e) => setGeneralData({ ...generalData, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Phone Number</label>
                            <input
                                type="tel"
                                value={generalData.phoneNumber}
                                onChange={(e) => setGeneralData({ ...generalData, phoneNumber: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Language Preference</label>
                            <select
                                value={generalData.languagePreference}
                                onChange={(e) => setGeneralData({ ...generalData, languagePreference: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white"
                            >
                                <option value="ENGLISH">English</option>
                                <option value="HINDI">Hindi</option>
                                <option value="KANNADA">Kannada</option>
                                <option value="TELUGU">Telugu</option>
                                <option value="TAMIL">Tamil</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleSaveGeneral}
                            disabled={saving}
                            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors font-medium"
                        >
                            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                            {profileExists ? 'Save Changes' : 'Create Profile'}
                        </button>
                    </div>
                </div>

                {/* Bank Details Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">Bank Details</h2>
                            <p className="text-sm text-slate-500">Manage your payment information</p>
                        </div>
                    </div>
                    {!profileExists ? (
                        <p className="text-slate-500 text-center py-8">Please create your profile first to add bank details.</p>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Account Holder Name</label>
                                    <input
                                        type="text"
                                        value={bankData.accountHolderName}
                                        onChange={(e) => setBankData({ ...bankData, accountHolderName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                        placeholder="Name as per bank records"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Bank Account Number</label>
                                    <input
                                        type="text"
                                        value={bankData.bankAccountNumber}
                                        onChange={(e) => setBankData({ ...bankData, bankAccountNumber: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                        placeholder="Enter account number"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">IFSC Code</label>
                                    <input
                                        type="text"
                                        value={bankData.ifscCode}
                                        onChange={(e) => setBankData({ ...bankData, ifscCode: e.target.value.toUpperCase() })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                        placeholder="Enter IFSC code"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">UPI ID</label>
                                    <input
                                        type="text"
                                        value={bankData.upiId}
                                        onChange={(e) => setBankData({ ...bankData, upiId: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                        placeholder="username@bank"
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={handleSaveBank}
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5 rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors font-medium"
                                >
                                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Save Bank Details
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Notification Settings Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Bell className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">Notification Preferences</h2>
                            <p className="text-sm text-slate-500">Choose what notifications you receive</p>
                        </div>
                    </div>
                    {!profileExists ? (
                        <p className="text-slate-500 text-center py-8">Please create your profile first to manage notifications.</p>
                    ) : (
                        <>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div>
                                        <h3 className="font-medium text-slate-900">Order Alerts</h3>
                                        <p className="text-sm text-slate-500">Notifications for new orders and status updates</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={notificationData.orderAlerts}
                                            onChange={(e) => setNotificationData({ ...notificationData, orderAlerts: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div>
                                        <h3 className="font-medium text-slate-900">Payment Alerts</h3>
                                        <p className="text-sm text-slate-500">Get notified when payments are processed</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={notificationData.paymentAlerts}
                                            onChange={(e) => setNotificationData({ ...notificationData, paymentAlerts: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div>
                                        <h3 className="font-medium text-slate-900">Bid Updates</h3>
                                        <p className="text-sm text-slate-500">Notifications for marketplace bid activity</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={notificationData.bidUpdates}
                                            onChange={(e) => setNotificationData({ ...notificationData, bidUpdates: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div>
                                        <h3 className="font-medium text-slate-900">Weather Alerts</h3>
                                        <p className="text-sm text-slate-500">Important weather updates for your farm location</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={notificationData.weatherAlerts}
                                            onChange={(e) => setNotificationData({ ...notificationData, weatherAlerts: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                    </label>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={handleSaveNotifications}
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-amber-600 text-white px-6 py-2.5 rounded-xl hover:bg-amber-700 disabled:opacity-50 transition-colors font-medium"
                                >
                                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Save Preferences
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </FarmerLayout>
    );
}
