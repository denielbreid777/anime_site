'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = 'http://127.0.0.1:8000';

interface UserProfile {
  username: string;
  email: string;
  is_admin: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('Anime Fan');
  const [email, setEmail] = useState('anime.fan@example.com');
  const [bio, setBio] = useState('Anime enthusiast and social network user');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    server?: string;
  }>({});

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/account/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: UserProfile = await response.json();
        setFullName(data.username);
        setEmail(data.email);
      } else if (response.status === 401 || response.status === 400) {
        localStorage.removeItem('access_token');
        router.push('/');
      } else {
        setErrors({ server: 'Не удалось загрузить данные профиля' });
      }
    } catch (error) {
      setErrors({ server: 'Не удалось подключиться к серверу' });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSaveChanges = async () => {
    const newErrors: { fullName?: string; email?: string; password?: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Name cannot be empty';
    }

    if (!email || !validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (newPassword || confirmNewPassword) {
      if (newPassword !== confirmNewPassword) {
        newErrors.password = 'Passwords do not match';
      } else if (newPassword.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Clear password fields after successful save
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  };

  const handleCancel = () => {
    setFullName('Anime Fan');
    setEmail('anime.fan@example.com');
    setBio('Anime enthusiast and social network user');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setErrors({});
  };

  const handleChangeAvatar = () => {
    alert('Demo: Avatar change is not implemented in this demo');
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/');
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = () => {
    setShowDeleteModal(false);
    alert('Demo: Account deletion is not implemented in this demo');
  };

  return (
    <div className="min-h-screen bg-[#0B0C10]">
      {isLoadingProfile ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-[#66FCF1] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-[#C5C6C7]">Loading profile...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="bg-[#1F2833] border-b border-[#45A29E]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0B0C10]">
                    <span className="text-xl font-bold text-[#66FCF1]">A</span>
                  </div>
                  <span className="text-xl font-bold text-[#C5C6C7]">AnimeSocial</span>
                </div>

                {/* User Actions */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#66FCF1] flex items-center justify-center">
                      <span className="text-[#0B0C10] font-semibold">{fullName.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-[#C5C6C7] hidden sm:block">{fullName}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg border border-[#45A29E] text-[#C5C6C7] hover:border-[#66FCF1] hover:text-[#66FCF1] transition-colors focus:outline-none focus:ring-2 focus:ring-[#66FCF1]"
                  >
                    Log out
                  </button>
                </div>
              </div>
            </div>
          </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2">Account Settings</h1>
          <p className="text-[#C5C6C7]">Manage your profile and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-[#1F2833] rounded-2xl p-4 shadow-2xl">
              <ul className="space-y-2">
                <li>
                  <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-[#45A29E] text-[#0B0C10] font-semibold">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Profile</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-[#C5C6C7] hover:bg-[#0B0C10] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Settings</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-[#C5C6C7] hover:bg-[#0B0C10] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span>Notifications</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-[#1F2833] rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-[#FFFFFF] mb-6">Personal Information</h2>
              
              {/* Avatar Section */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-[#66FCF1] flex items-center justify-center">
                    <span className="text-3xl font-bold text-[#0B0C10]">AF</span>
                  </div>
                  <button
                    onClick={handleChangeAvatar}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#45A29E] flex items-center justify-center hover:bg-[#66FCF1] transition-colors focus:outline-none focus:ring-2 focus:ring-[#66FCF1]"
                    aria-label="Change avatar"
                  >
                    <svg className="w-4 h-4 text-[#0B0C10]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                <div>
                  <button
                    onClick={handleChangeAvatar}
                    className="px-4 py-2 rounded-lg bg-[#45A29E] text-[#0B0C10] font-semibold hover:bg-[#66FCF1] transition-colors focus:outline-none focus:ring-2 focus:ring-[#66FCF1]"
                  >
                    Change Avatar
                  </button>
                  <p className="text-sm text-[#C5C6C7] mt-2">JPG, PNG or GIF. Max size 2MB</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-[#C5C6C7] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                    }}
                    className={`w-full px-4 py-3 rounded-lg bg-[#0B0C10] border-2 ${
                      errors.fullName ? 'border-red-500' : 'border-[#45A29E]'
                    } text-[#FFFFFF] placeholder-[#45A29E] focus:outline-none focus:border-[#66FCF1] transition-colors`}
                    placeholder="Enter your full name"
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  />
                  {errors.fullName && (
                    <p id="fullName-error" className="mt-2 text-sm text-red-400" role="alert">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#C5C6C7] mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      className={`w-full px-4 py-3 pr-12 rounded-lg bg-[#0B0C10] border-2 ${
                        errors.email ? 'border-red-500' : 'border-[#45A29E]'
                      } text-[#FFFFFF] placeholder-[#45A29E] focus:outline-none focus:border-[#66FCF1] transition-colors`}
                      placeholder="Enter your email"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  {errors.email && (
                    <p id="email-error" className="mt-2 text-sm text-red-400" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-[#C5C6C7] mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] placeholder-[#45A29E] focus:outline-none focus:border-[#66FCF1] transition-colors resize-none"
                    placeholder="Tell us about yourself"
                  />
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-[#1F2833] rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-[#FFFFFF] mb-6">Security</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-[#C5C6C7] mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] placeholder-[#45A29E] focus:outline-none focus:border-[#66FCF1] transition-colors"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-[#C5C6C7] mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] placeholder-[#45A29E] focus:outline-none focus:border-[#66FCF1] transition-colors"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-[#C5C6C7] mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    value={confirmNewPassword}
                    onChange={(e) => {
                      setConfirmNewPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    className={`w-full px-4 py-3 rounded-lg bg-[#0B0C10] border-2 ${
                      errors.password ? 'border-red-500' : 'border-[#45A29E]'
                    } text-[#FFFFFF] placeholder-[#45A29E] focus:outline-none focus:border-[#66FCF1] transition-colors`}
                    placeholder="Confirm new password"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  {errors.password && (
                    <p id="password-error" className="mt-2 text-sm text-red-400" role="alert">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-[#1F2833] rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-[#FFFFFF] mb-6">Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[#C5C6C7] font-medium">Email Notifications</h3>
                    <p className="text-sm text-[#45A29E]">Receive email updates about your account</p>
                  </div>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#66FCF1] ${
                      emailNotifications ? 'bg-[#66FCF1]' : 'bg-[#45A29E]'
                    }`}
                    role="switch"
                    aria-checked={emailNotifications}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-[#0B0C10] transition-transform ${
                        emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[#C5C6C7] font-medium">Dark Mode</h3>
                    <p className="text-sm text-[#45A29E]">Use dark theme across the application</p>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#66FCF1] ${
                      darkMode ? 'bg-[#66FCF1]' : 'bg-[#45A29E]'
                    }`}
                    role="switch"
                    aria-checked={darkMode}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-[#0B0C10] transition-transform ${
                        darkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[#C5C6C7] font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-[#45A29E]">Add an extra layer of security</p>
                  </div>
                  <button
                    onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#66FCF1] ${
                      twoFactorAuth ? 'bg-[#66FCF1]' : 'bg-[#45A29E]'
                    }`}
                    role="switch"
                    aria-checked={twoFactorAuth}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-[#0B0C10] transition-transform ${
                        twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleSaveChanges}
                disabled={isLoading}
                className="flex-1 py-3 px-6 rounded-lg bg-[#66FCF1] text-[#0B0C10] font-semibold hover:bg-[#45A29E] focus:outline-none focus:ring-2 focus:ring-[#66FCF1] focus:ring-offset-2 focus:ring-offset-[#1F2833] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#0B0C10]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 py-3 px-6 rounded-lg border-2 border-[#45A29E] text-[#C5C6C7] font-semibold hover:border-[#66FCF1] hover:text-[#66FCF1] focus:outline-none focus:ring-2 focus:ring-[#66FCF1] focus:ring-offset-2 focus:ring-offset-[#1F2833] transition-colors"
              >
                Cancel
              </button>
            </div>

            {/* Danger Zone */}
            <div className="bg-[#1F2833] rounded-2xl p-6 shadow-2xl border-2 border-red-900">
              <h2 className="text-xl font-bold text-red-400 mb-2">Danger Zone</h2>
              <p className="text-[#C5C6C7] mb-4">Once you delete your account, there is no going back. Please be certain.</p>
              <button
                onClick={handleDeleteAccount}
                className="px-6 py-3 rounded-lg bg-red-900 text-red-400 font-semibold hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#1F2833] transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1F2833] rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-[#FFFFFF] mb-4">Delete Account</h3>
            <p className="text-[#C5C6C7] mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 px-6 rounded-lg border-2 border-[#45A29E] text-[#C5C6C7] font-semibold hover:border-[#66FCF1] hover:text-[#66FCF1] focus:outline-none focus:ring-2 focus:ring-[#66FCF1] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAccount}
                className="flex-1 py-3 px-6 rounded-lg bg-red-900 text-red-400 font-semibold hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-[#45A29E] text-[#0B0C10] px-6 py-3 rounded-lg shadow-lg animate-pulse">
          Profile updated successfully
        </div>
      )}
        </>
      )}
    </div>
  );
}
