import { useState } from 'react';
import { Shield, Lock, LogOut, User, Save } from 'lucide-react';

// Reusing Sidebar Layout

const StudentSettingsPage = () => {
  // --- STATE ---
  const [profileData, setProfileData] = useState({
    firstName: 'Alex',
    lastName: 'Johnson',
    college: 'Indore Institute of Science & Technology',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
  });

  const [isProfileLocked, setIsProfileLocked] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

  // Handlers
  const handleProfileUpdate = e => {
    e.preventDefault();
    alert('Profile details updated successfully!');
  };

  const handlePasswordChange = e => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      alert('New passwords do not match!');
      return;
    }
    alert('Password changed successfully!');
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const handleLogout = (allDevices = false) => {
    if (allDevices) {
      alert('Logged out from all devices.');
    } else {
      alert('Logged out successfully.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white flex overflow-hidden">
      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* 1. Update Profile Section */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <User size={20} className="text-blue-500" /> Profile Details
              </h2>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={e => setProfileData({ ...profileData, firstName: e.target.value })}
                      className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={e => setProfileData({ ...profileData, lastName: e.target.value })}
                      className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      College / University
                    </label>
                    <input
                      type="text"
                      value={profileData.college}
                      onChange={e => setProfileData({ ...profileData, college: e.target.value })}
                      className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      Course
                    </label>
                    <input
                      type="text"
                      value={profileData.course}
                      onChange={e => setProfileData({ ...profileData, course: e.target.value })}
                      className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      Year
                    </label>
                    <input
                      type="text"
                      value={profileData.year}
                      onChange={e => setProfileData({ ...profileData, year: e.target.value })}
                      className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
                  >
                    <Save size={18} /> Update Profile
                  </button>
                </div>
              </form>
            </section>

            {/* 2. Privacy / Lock Profile Section */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Shield size={20} className="text-green-500" /> Privacy Settings
                  </h2>
                  <p className="text-sm text-zinc-400 mt-1">
                    Manage who can see your profile information.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isProfileLocked}
                    onChange={() => setIsProfileLocked(!isProfileLocked)}
                  />
                  <div className="w-14 h-7 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-medium text-white">
                    {isProfileLocked ? 'Locked' : 'Public'}
                  </span>
                </label>
              </div>

              <div
                className={`p-4 rounded-xl border ${isProfileLocked ? 'bg-blue-900/20 border-blue-500/30' : 'bg-zinc-800/50 border-zinc-700'}`}
              >
                <div className="flex items-start gap-3">
                  {isProfileLocked ? (
                    <Lock size={20} className="text-blue-400 mt-1" />
                  ) : (
                    <User size={20} className="text-zinc-400 mt-1" />
                  )}
                  <div>
                    <h4 className="font-bold text-sm text-white mb-1">
                      {isProfileLocked ? 'Your Profile is Hidden' : 'Your Profile is Visible'}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {isProfileLocked
                        ? 'Only your Name, College, Course, and Year will be visible on the Leaderboard. Your email, phone number, and social links are hidden from other students.'
                        : 'Your profile details and social links are visible to other students on the Leaderboard for networking purposes.'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Change Password Section */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Lock size={20} className="text-orange-500" /> Security
              </h2>
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.current}
                    onChange={e => setPasswordData({ ...passwordData, current: e.target.value })}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Enter current password"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.new}
                      onChange={e => setPasswordData({ ...passwordData, new: e.target.value })}
                      className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="Min 8 characters"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirm}
                      onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })}
                      className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="Re-enter new password"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="border border-zinc-700 hover:bg-zinc-800 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </section>

            {/* 4. Logout Zone */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-bold mb-6 text-red-500 flex items-center gap-2">
                <LogOut size={20} /> Session Management
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleLogout(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-bold transition-colors"
                >
                  Log Out
                </button>
                <button
                  onClick={() => handleLogout(true)}
                  className="flex-1 bg-red-900/20 border border-red-900/50 text-red-400 hover:bg-red-900/30 py-3 rounded-xl font-bold transition-colors"
                >
                  Log Out from All Devices
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSettingsPage;
