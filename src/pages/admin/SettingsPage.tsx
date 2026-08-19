import React, { useState, useEffect } from 'react';
import { Settings, Save, User, Store, Shield, Bell, Mail, Database } from 'lucide-react';

interface AdminSettings {
  // Store Settings
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  
  // Admin Account
  adminName: string;
  adminEmail: string;
  
  // Notification Settings
  emailNotifications: boolean;
  orderAlerts: boolean;
  stockAlerts: boolean;
  
  // System Settings
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  requireEmailVerification: boolean;
  
  // Display Settings
  currency: string;
  timezone: string;
  dateFormat: string;
}

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AdminSettings>({
    storeName: 'Nestania',
    storeEmail: 'hello@nestania.com',
    storePhone: '+91 98765 43210',
    storeAddress: '123 Artisan Street, Pottery District, Mumbai 400001',
    adminName: 'Admin User',
    adminEmail: localStorage.getItem('admin_email') || 'admin@nestania.com',
    emailNotifications: true,
    orderAlerts: true,
    stockAlerts: false,
    maintenanceMode: false,
    allowRegistrations: true,
    requireEmailVerification: false,
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY'
  });

  const [activeTab, setActiveTab] = useState('store');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('admin_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...settings, ...parsed });
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  const handleInputChange = (key: keyof AdminSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage (in production, this would be an API call)
      localStorage.setItem('admin_settings', JSON.stringify(settings));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Failed to save settings. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'store', label: 'Store Info', icon: Store },
    { id: 'admin', label: 'Admin Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Shield },
    { id: 'display', label: 'Display', icon: Settings }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-6 h-6 text-[#8A5A36]" />
          <h1 className="text-2xl font-bold text-[#2C1810]">Settings</h1>
        </div>
        <p className="text-[#7A6A5E]">Manage your store configuration and preferences</p>
      </div>

      {/* Save Button & Message */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-4">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#8A5A36] text-white'
                    : 'bg-white text-[#7A6A5E] hover:bg-[#F5F1EB]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
        
        <div className="flex items-center gap-4">
          {saveMessage && (
            <span className={`text-sm ${saveMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {saveMessage}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#8A5A36] text-white px-6 py-2 rounded-lg hover:bg-[#6D4228] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Settings Content */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E5DDD5] p-6">
        {/* Store Info Tab */}
        {activeTab === 'store' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#2C1810] flex items-center gap-2">
              <Store className="w-5 h-5" />
              Store Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#2C1810] mb-2">Store Name</label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => handleInputChange('storeName', e.target.value)}
                  className="w-full px-4 py-2 border border-[#E5DDD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A5A36]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#2C1810] mb-2">Store Email</label>
                <input
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => handleInputChange('storeEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-[#E5DDD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A5A36]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#2C1810] mb-2">Store Phone</label>
                <input
                  type="tel"
                  value={settings.storePhone}
                  onChange={(e) => handleInputChange('storePhone', e.target.value)}
                  className="w-full px-4 py-2 border border-[#E5DDD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A5A36]"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#2C1810] mb-2">Store Address</label>
                <textarea
                  value={settings.storeAddress}
                  onChange={(e) => handleInputChange('storeAddress', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-[#E5DDD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A5A36]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Admin Account Tab */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#2C1810] flex items-center gap-2">
              <User className="w-5 h-5" />
              Admin Account
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#2C1810] mb-2">Admin Name</label>
                <input
                  type="text"
                  value={settings.adminName}
                  onChange={(e) => handleInputChange('adminName', e.target.value)}
                  className="w-full px-4 py-2 border border-[#E5DDD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A5A36]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#2C1810] mb-2">Admin Email</label>
                <input
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-[#E5DDD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A5A36]"
                />
              </div>
            </div>
            
            <div className="bg-[#FFF4E6] border border-[#F4D03F] rounded-lg p-4">
              <p className="text-sm text-[#8A5A36]">
                <strong>Note:</strong> Changing the admin email will require you to log in again with the new credentials.
              </p>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#2C1810] flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Preferences
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#FAF8F5] rounded-lg">
                <div>
                  <h3 className="font-medium text-[#2C1810]">Email Notifications</h3>
                  <p className="text-sm text-[#7A6A5E]">Receive general email notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8A5A36]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-[#FAF8F5] rounded-lg">
                <div>
                  <h3 className="font-medium text-[#2C1810]">New Order Alerts</h3>
                  <p className="text-sm text-[#7A6A5E]">Get notified when new orders are placed</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.orderAlerts}
                    onChange={(e) => handleInputChange('orderAlerts', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8A5A36]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-[#FAF8F5] rounded-lg">
                <div>
                  <h3 className="font-medium text-[#2C1810]">Low Stock Alerts</h3>
                  <p className="text-sm text-[#7A6A5E]">Get notified when products are running low</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.stockAlerts}
                    onChange={(e) => handleInputChange('stockAlerts', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8A5A36]"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#2C1810] flex items-center gap-2">
              <Shield className="w-5 h-5" />
              System Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#FAF8F5] rounded-lg">
                <div>
                  <h3 className="font-medium text-[#2C1810]">Maintenance Mode</h3>
                  <p className="text-sm text-[#7A6A5E]">Temporarily disable the store for maintenance</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-[#FAF8F5] rounded-lg">
                <div>
                  <h3 className="font-medium text-[#2C1810]">Allow Customer Registration</h3>
                  <p className="text-sm text-[#7A6A5E]">Allow new customers to create accounts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowRegistrations}
                    onChange={(e) => handleInputChange('allowRegistrations', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8A5A36]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-[#FAF8F5] rounded-lg">
                <div>
                  <h3 className="font-medium text-[#2C1810]">Require Email Verification</h3>
                  <p className="text-sm text-[#7A6A5E]">New customers must verify their email before accessing the store</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.requireEmailVerification}
                    onChange={(e) => handleInputChange('requireEmailVerification', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8A5A36]"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Display Tab */}
        {activeTab === 'display' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#2C1810] flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Display Settings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#2C1810] mb-2">Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-4 py-2 border border-[#E5DDD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A5A36]"
                >
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#2C1810] mb-2">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className="w-full px-4 py-2 border border-[#E5DDD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A5A36]"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#2C1810] mb-2">Date Format</label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                  className="w-full px-4 py-2 border border-[#E5DDD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A5A36]"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;