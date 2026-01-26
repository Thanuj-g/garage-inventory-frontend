import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/card';
import { Button } from '../components/button';
import { Input } from '../components/input';
import { Label } from '../components/lable';
import { Switch } from '../components/switch';
import { Separator } from '../components/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/select';
import { User, Building, Bell, Shield, Database } from 'lucide-react';

export function SettingsPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('settings');

  const [notifications, setNotifications] = useState({
    lowStock: true,
    newOrders: true,
    deliveries: false,
    sales: true
  });

  const [settings, setSettings] = useState({
    garageName: 'Auto Works Garage',
    email: 'admin@autoworks.com',
    phone: '+94 77 123 4567',
    address: 'No. 123, Galle Road, Colombo 03, Sri Lanka',
    lowStockThreshold: '20',
    currency: 'USD',
    // timezone removed
    role: '',
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          navigate(`/${page}`);
        }}
        onLogout={() => navigate('/')}
      />

      <main className="flex-1 p-6 bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-gray-500">Manage your garage and system preferences</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          {/* Garage Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                <CardTitle>Garage Information</CardTitle>
              </div>
              <CardDescription>Update your garage details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Garage Name</Label>
                  <Input
                    value={settings.garageName}
                    onChange={(e) => setSettings({ ...settings, garageName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  />
                </div>
                {/* Timezone removed */}
                <div className="col-span-2 space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          {/* User Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <CardTitle>User Profile</CardTitle>
              </div>
              <CardDescription>Manage your personal account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input defaultValue="Admin User" />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <div className="p-3 bg-slate-50 rounded-lg border">
                    <Select value={settings.role} onValueChange={(v) => setSettings({ ...settings, role: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {!settings.role && <p className="text-xs text-red-500">Please select a role</p>}
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  disabled={!settings.role}
                  className={`${!settings.role ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Update Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                <CardTitle>Notification Preferences</CardTitle>
              </div>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Low Stock Alerts', key: 'lowStock', description: 'Get notified when items are running low' },
                { label: 'New Purchase Orders', key: 'newOrders', description: 'Notifications for new orders placed' },
                { label: 'Delivery Updates', key: 'deliveries', description: 'Updates on order deliveries' },
                { label: 'Daily Sales Summary', key: 'sales', description: 'Receive daily sales reports' }
              ].map((item) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{item.label}</Label>
                      <p className="text-sm text-slate-500">{item.description}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key]}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
                    />
                  </div>
                  <Separator />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          {/* System Preferences */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                <CardTitle>System Preferences</CardTitle>
              </div>
              <CardDescription>Configure system-wide settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={settings.currency} onValueChange={(value) => setSettings({ ...settings, currency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Low Stock Threshold</Label>
                  <Input
                    type="number"
                    value={settings.lowStockThreshold}
                    onChange={(e) => setSettings({ ...settings, lowStockThreshold: e.target.value })}
                  />
                  <p className="text-xs text-slate-500">Default minimum stock level for alerts</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700">Save Preferences</Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Export or backup your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: 'Export Inventory', desc: 'Download all inventory data as CSV' },
                { title: 'Export Sales Records', desc: 'Download sales history as CSV' },
                { title: 'Backup Database', desc: 'Create a complete backup of all data' }
              ].map((item) => (
                <div key={item.title} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                  <Button variant="outline">{item.title.includes('Backup') ? 'Backup' : 'Export'}</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <CardTitle>Security Settings</CardTitle>
              </div>
              <CardDescription>Manage your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700">Change Password</Button>
              </div>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable 2FA</Label>
                  <p className="text-sm text-slate-500">Require verification code in addition to password</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                <div>
                  <p className="font-medium text-red-600">Delete All Data</p>
                  <p className="text-sm text-slate-600">Permanently delete all inventory and records</p>
                </div>
                <Button variant="destructive">Delete All</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </main>
    </div>
  );
}

export default SettingsPage;