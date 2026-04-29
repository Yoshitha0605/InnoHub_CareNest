import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getSettings, updateSettings, getStoredUser } from '../services/api';
import {
  Settings,
  Bell,
  Shield,
  Database,
  User,
  Palette,
  Sun,
  Moon,
  AlertTriangle,
  Mail,
  Smartphone,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Crown,
  Activity,
  CheckCircle
} from 'lucide-react';

const SettingsPage = ({ theme, onThemeChange }) => {
  const defaultSettings = {
    theme: 'dark',
    alertThresholds: {
      patientCapacity: 85,
      icuUsage: 90,
      staffShortage: 20,
    },
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      pushNotifications: true,
      criticalAlerts: true,
      maintenanceAlerts: false,
    },
    profile: {
      name: '',
      role: '',
      hospital: 'Metro General Hospital',
      email: '',
    },
    adminSettings: {
      demoMode: true,
      dataRetention: 365,
      autoBackup: true,
      maintenanceMode: false,
    },
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [showPassword, setShowPassword] = useState(false);
  const [settingsStatus, setSettingsStatus] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const apiSettings = await getSettings();
        const savedSettings = localStorage.getItem('hospital-settings');
        const parsedSettings = savedSettings ? JSON.parse(savedSettings) : {};

        setSettings(prev => ({
          ...prev,
          theme: parsedSettings.theme || apiSettings.theme_mode || localStorage.getItem('theme') || 'dark',
          alertThresholds: {
            ...prev.alertThresholds,
            patientCapacity: parsedSettings.alertThresholds?.patientCapacity ?? apiSettings.alert_thresholds?.patient_count ?? prev.alertThresholds.patientCapacity,
            icuUsage: parsedSettings.alertThresholds?.icuUsage ?? apiSettings.alert_thresholds?.icu_usage ?? prev.alertThresholds.icuUsage,
            staffShortage: parsedSettings.alertThresholds?.staffShortage ?? prev.alertThresholds.staffShortage,
          },
          notifications: {
            ...prev.notifications,
            emailAlerts: parsedSettings.notifications?.emailAlerts ?? apiSettings.notification_preferences?.email ?? prev.notifications.emailAlerts,
            smsAlerts: parsedSettings.notifications?.smsAlerts ?? apiSettings.notification_preferences?.sms ?? prev.notifications.smsAlerts,
            pushNotifications: parsedSettings.notifications?.pushNotifications ?? apiSettings.notification_preferences?.push ?? prev.notifications.pushNotifications,
            criticalAlerts: parsedSettings.notifications?.criticalAlerts ?? prev.notifications.criticalAlerts,
            maintenanceAlerts: parsedSettings.notifications?.maintenanceAlerts ?? prev.notifications.maintenanceAlerts,
          },
          adminSettings: parsedSettings.adminSettings || prev.adminSettings,
        }));
      } catch (err) {
        console.error('Unable to load settings', err);
      }
    };

    // Load user data from stored session
    try {
      const user = getStoredUser();
      if (user) {
        setSettings(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            name: user.username || user.name || '',
            role: user.role || '',
            email: user.email || '',
          },
        }));
      }
    } catch (err) {
      console.error('Unable to load user data', err);
    }

    loadSettings();
  }, []);

  useEffect(() => {
    // Force dark theme for demo stability
    document.body.classList.remove('dark', 'light');
    document.body.classList.add('dark');
  }, []);

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' && prev[section] !== null
        ? { ...prev[section], [key]: value }
        : value,
    }));
  };

  const handleThemeToggle = () => {
    // Disable switching for demo stability
    alert("Light mode temporarily disabled for stability");
  };

  const handleThresholdChange = (key, value) => {
    updateSetting('alertThresholds', key, parseInt(value));
  };

  const handleNotificationChange = (key, value) => {
    updateSetting('notifications', key, value);

    // Show notification alert
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    setNotificationMsg(`${label} ${value ? 'enabled' : 'disabled'}`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleNotificationTest = (type) => {
    setNotificationMsg(`${type} notification test sent!`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleProfileChange = (key, value) => {
    updateSetting('profile', key, value);
  };

  const handleAdminChange = (key, value) => {
    updateSetting('adminSettings', key, value);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    localStorage.setItem('theme', defaultSettings.theme);
    localStorage.setItem('hospital-settings', JSON.stringify(defaultSettings));
    if (onThemeChange) {
      onThemeChange(defaultSettings.theme);
    }
    console.log('Settings reset to defaults, theme:', defaultSettings.theme);
    setSettingsStatus('✓ Settings reset to defaults.');
    setTimeout(() => setSettingsStatus(''), 3500);
  };

  const handleSave = async () => {
    try {
      console.log('Saving settings with theme:', settings.theme);
      const saved = await updateSettings({
        theme_mode: settings.theme,
        alert_thresholds: {
          patient_count: settings.alertThresholds.patientCapacity,
          icu_usage: settings.alertThresholds.icuUsage,
          occupancy_rate: 0,
        },
        notification_preferences: {
          email: settings.notifications.emailAlerts,
          sms: settings.notifications.smsAlerts,
          push: settings.notifications.pushNotifications,
        },
      });
      console.log('Settings saved:', saved);
      localStorage.setItem('theme', settings.theme);
      localStorage.setItem('hospital-settings', JSON.stringify(settings));
      console.log('All data persisted to localStorage:', {
        theme: localStorage.getItem('theme'),
        settings: localStorage.getItem('hospital-settings')
      });
      setSettingsStatus('✓ Settings updated successfully.');
      setTimeout(() => setSettingsStatus(''), 3500);
    } catch (err) {
      console.error('Error saving settings', err);
      setSettingsStatus('✗ Unable to save settings. Please try again.');
      setTimeout(() => setSettingsStatus(''), 4000);
    }
  };

  // Force dark theme for stability
  const isDark = true;  // Always true for demo stability
  const bgClass = 'bg-slate-950 text-slate-100';
  const cardClass = 'rounded-[2rem] border p-8 shadow-2xl transition border-white/10 bg-slate-900/90 shadow-slate-950/25';
  const sectionCardClass = 'rounded-xl p-4 bg-slate-800/50';
  const titleText = 'text-white';
  const labelText = 'text-slate-300';
  const bodyText = 'text-slate-400';
  const inputStyle = 'border-slate-700 bg-slate-950/90 text-white placeholder-slate-400';

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.header
          className={`${cardClass} backdrop-blur-xl`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className={`inline-flex rounded-full border px-4 py-2 text-sm ${
                isDark
                  ? 'border-white/10 bg-white/5 text-slate-200'
                  : 'border-slate-200 bg-slate-100 text-slate-700'
              }`}>
                <Settings className={`w-4 h-4 mr-2 ${isDark ? 'text-white' : 'text-slate-700'}`} />
                System Configuration
              </p>
              <h1 className={`text-4xl font-semibold tracking-tight sm:text-5xl ${titleText} main-heading`}>
                Hospital Settings
              </h1>
              <p className={`text-lg leading-8 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Configure system preferences, notification settings, security options, and customize your CareNest experience.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleSave}
                className="inline-flex items-center rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:shadow-xl hover:scale-[1.02]"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
              {settingsStatus && (
                <p className={`text-sm ${bodyText}`}>{settingsStatus}</p>
              )}
              {showNotification && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 rounded-lg bg-primary-500/20 border border-primary-500/30 text-primary-100 text-sm"
                >
                  {notificationMsg}
                </motion.div>
              )}
            </div>
          </div>
        </motion.header>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* Main Settings Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Theme Settings */}
            <motion.div
              className={cardClass}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center">
                  <Palette className={`w-6 h-6 ${isDark ? 'text-white' : 'text-slate-700'}`} />
                </div>
                <div>
                  <h3 className={`text-xl font-semibold ${titleText}`}>Appearance</h3>
                  <p className={`${bodyText} text-sm`}>Customize the visual theme and display preferences</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? <Moon className="w-5 h-5 text-slate-400" /> : <Sun className="w-5 h-5 text-slate-700" />}
                    <div>
                      <p className={`font-medium ${titleText}`}>Theme Mode</p>
                      <p className={`${bodyText} text-sm`}>Switch between light and dark themes</p>
                    </div>
                  </div>
                  <button
                    onClick={handleThemeToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      theme === 'dark' ? 'bg-primary-500' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Alert Threshold Controls */}
            <motion.div
              className={cardClass}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-warning-500 to-warning-600 rounded-xl flex items-center justify-center">
                  <AlertTriangle className={`w-6 h-6 ${isDark ? 'text-white' : 'text-slate-700'}`} />
                </div>
                <div>
                  <h3 className={`text-xl font-semibold ${titleText}`}>Alert Thresholds</h3>
                  <p className={`${bodyText} text-sm`}>Configure when alerts should be triggered</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${labelText}`}>
                    Patient Capacity Alert (%)
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={settings.alertThresholds.patientCapacity}
                    onChange={(e) => handleThresholdChange('patientCapacity', e.target.value)}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className={`flex justify-between text-sm ${bodyText}`}>
                    <span>50%</span>
                    <span className={`font-medium ${titleText}`}>{settings.alertThresholds.patientCapacity}%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${labelText}`}>
                    ICU Usage Alert (%)
                  </label>
                  <input
                    type="range"
                    min="70"
                    max="100"
                    value={settings.alertThresholds.icuUsage}
                    onChange={(e) => handleThresholdChange('icuUsage', e.target.value)}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className={`flex justify-between text-sm ${bodyText}`}>
                    <span>70%</span>
                    <span className={`font-medium ${titleText}`}>{settings.alertThresholds.icuUsage}%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${labelText}`}>
                    Staff Shortage Alert (%)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={settings.alertThresholds.staffShortage}
                    onChange={(e) => handleThresholdChange('staffShortage', e.target.value)}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className={`flex justify-between text-sm ${bodyText}`}>
                    <span>10%</span>
                    <span className={`font-medium ${titleText}`}>{settings.alertThresholds.staffShortage}%</span>
                    <span>50%</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Notification Settings */}
            <motion.div
              className={cardClass}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-xl font-semibold ${titleText}`}>Notifications</h3>
                  <p className={`${bodyText} text-sm`}>Manage how and when you receive alerts</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'emailAlerts', label: 'Email Alerts', icon: Mail, description: 'Receive alerts via email' },
                  { key: 'smsAlerts', label: 'SMS Alerts', icon: Smartphone, description: 'Receive critical alerts via SMS' },
                  { key: 'pushNotifications', label: 'Push Notifications', icon: Bell, description: 'Browser push notifications' },
                  { key: 'criticalAlerts', label: 'Critical Alerts Only', icon: AlertTriangle, description: 'Only high-priority alerts' },
                  { key: 'maintenanceAlerts', label: 'Maintenance Alerts', icon: Settings, description: 'System maintenance notifications' },
                ].map((item) => (
                  <div key={item.key} className={`${sectionCardClass} flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-700'}`} />
                      <div>
                        <p className={`font-medium ${titleText}`}>{item.label}</p>
                        <p className={`${bodyText} text-sm`}>{item.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(item.key, !settings.notifications[item.key])}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications[item.key] ? 'bg-primary-500' : 'bg-slate-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Profile Section */}
            <motion.div
              className={cardClass}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-xl font-semibold ${titleText}`}>Profile Information</h3>
                  <p className={`${bodyText} text-sm`}>Update your personal and professional details</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${labelText}`}>Full Name</label>
                  <input
                    type="text"
                    value={settings.profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border focus:border-primary-400 focus:outline-none transition-colors ${inputStyle}`}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${labelText}`}>Role</label>
                  <input
                    type="text"
                    value={settings.profile.role}
                    onChange={(e) => handleProfileChange('role', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border focus:border-primary-400 focus:outline-none transition-colors ${inputStyle}`}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${labelText}`}>Hospital</label>
                  <input
                    type="text"
                    value={settings.profile.hospital}
                    onChange={(e) => handleProfileChange('hospital', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border focus:border-primary-400 focus:outline-none transition-colors ${inputStyle}`}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${labelText}`}>Email</label>
                  <input
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border focus:border-primary-400 focus:outline-none transition-colors ${inputStyle}`}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Demo Admin Controls */}
          <div className="space-y-8">
            <motion.div
              className={cardClass}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-danger-500 to-danger-600 rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-xl font-semibold ${titleText}`}>Admin Controls</h3>
                  <p className={`${bodyText} text-sm`}>Demo administrative settings</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className={`${sectionCardClass} flex items-center justify-between`}>
                  <div>
                    <p className={`font-medium ${titleText}`}>Demo Mode</p>
                    <p className={`${bodyText} text-sm`}>Enable demo data and features</p>
                  </div>
                  <button
                    onClick={() => handleAdminChange('demoMode', !settings.adminSettings.demoMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.adminSettings.demoMode ? 'bg-success-500' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.adminSettings.demoMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className={`${sectionCardClass} flex items-center justify-between`}>
                  <div>
                    <p className={`font-medium ${titleText}`}>Auto Backup</p>
                    <p className={`${bodyText} text-sm`}>Automatic data backups</p>
                  </div>
                  <button
                    onClick={() => handleAdminChange('autoBackup', !settings.adminSettings.autoBackup)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.adminSettings.autoBackup ? 'bg-success-500' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.adminSettings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className={`${sectionCardClass} flex items-center justify-between`}>
                  <div>
                    <p className={`font-medium ${titleText}`}>Maintenance Mode</p>
                    <p className={`${bodyText} text-sm`}>Put system in maintenance</p>
                  </div>
                  <button
                    onClick={() => handleAdminChange('maintenanceMode', !settings.adminSettings.maintenanceMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.adminSettings.maintenanceMode ? 'bg-warning-500' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.adminSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${labelText}`}>
                    Data Retention (days)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="3650"
                    value={settings.adminSettings.dataRetention}
                    onChange={(e) => handleAdminChange('dataRetention', parseInt(e.target.value))}
                    className={`w-full px-4 py-3 rounded-xl border focus:border-primary-400 focus:outline-none transition-colors ${inputStyle}`}
                  />
                </div>

                <button
                  onClick={handleReset}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:shadow-xl hover:scale-[1.02]"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </button>
              </div>
            </motion.div>

            {/* System Status */}
            <motion.div
              className={`${cardClass.replace('p-8', 'p-6')}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Activity className={`w-5 h-5 ${isDark ? 'text-success-400' : 'text-success-600'}`} />
                <h4 className={`text-lg font-semibold ${titleText}`}>System Status</h4>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`${bodyText}`}>AI Model</span>
                  <span className={`text-success-400`}>Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${bodyText}`}>Database</span>
                  <span className={`text-success-400`}>Connected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${bodyText}`}>Notifications</span>
                  <span className={`text-success-400`}>Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${bodyText}`}>Last Backup</span>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>2 hours ago</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;