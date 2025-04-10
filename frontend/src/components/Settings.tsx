import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface SettingsFormData {
  notifications: boolean;
  theme: string;
  language: string;
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState<SettingsFormData>({
    notifications: true,
    theme: 'light',
    language: 'en'
  });

  const handleInputChange = (field: keyof SettingsFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement settings update
      toast({
        title: 'Success',
        description: 'Settings updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update settings',
        variant: 'destructive'
      });
    }
  };

  if (!user || (user.role !== 'superadmin' && user.role !== 'admin')) {
    return (
      <div className="p-4">
        <div className="text-red-500">You don't have permission to access this page.</div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Notifications</Label>
              <Switch
                checked={formData.notifications}
                onCheckedChange={(checked) => handleInputChange('notifications', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label>Theme</Label>
              <Input
                value={formData.theme}
                onChange={(e) => handleInputChange('theme', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <Input
                value={formData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
              />
            </div>

            <Button type="submit">Save Settings</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;