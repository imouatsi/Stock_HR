import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from '@/components/theme-provider';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { changePassword, setInactivityTimeout } = useAuth();

  // Define hardcoded languages
  const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' }
  ];

  // State for settings
  const [pushNotifications, setPushNotifications] = useState(true);

  // State for password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // State for inactivity timeout
  const [inactivityTimeoutValue, setInactivityTimeoutValue] = useState<number>(() => {
    const savedTimeout = localStorage.getItem('inactivityTimeout');
    return savedTimeout ? parseInt(savedTimeout, 10) : 600; // Default to 10 minutes
  });

  const handleSaveSettings = () => {
    toast({
      title: t('settings.title'),
      description: t('settings.settingsSaved'),
    });
  };

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  const handlePasswordChange = async () => {
    // Reset states
    setPasswordError(null);
    setPasswordSuccess(false);

    // Validate passwords
    if (!currentPassword) {
      setPasswordError(t('settings.currentPasswordRequired'));
      return;
    }

    if (!newPassword) {
      setPasswordError(t('settings.newPasswordRequired'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t('settings.passwordsDoNotMatch'));
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(t('settings.passwordTooShort'));
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast({
        title: t('settings.changePassword'),
        description: t('settings.passwordChanged'),
      });
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : t('settings.passwordError'));
    }
  };

  const formatTimeout = (seconds: number): string => {
    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds > 0 ? `and ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}` : ''}`;
    }
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  };

  const handleInactivityTimeoutChange = (value: number[]) => {
    const timeout = value[0];
    setInactivityTimeoutValue(timeout);
    setInactivityTimeout(timeout);
    toast({
      title: t('settings.inactivityTimeoutUpdated'),
      description: t('settings.inactivityTimeoutDescription'),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>{t('settings.appearance')}</CardTitle>
            <CardDescription>{t('settings.customizeLookAndFeel')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="theme">{t('settings.darkMode')}</Label>
                <p className="text-sm text-muted-foreground">{t('settings.toggleDarkMode')}</p>
              </div>
              <Switch
                id="theme"
                checked={theme === 'dark'}
                onCheckedChange={handleThemeChange}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="language">{t('settings.language')}</Label>
              <Select value={i18n.language} onValueChange={handleLanguageChange}>
                <SelectTrigger id="language">
                  <SelectValue placeholder={t('settings.selectLanguage')} />
                </SelectTrigger>
                <SelectContent>
                  {availableLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">{t('settings.changeLanguage')}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle>{t('settings.security')}</CardTitle>
            <CardDescription>{t('settings.manageSecuritySettings')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('settings.changePassword')}</h3>

              {passwordError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{t('common.error.title')}</AlertTitle>
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}

              {passwordSuccess && (
                <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                  <AlertTitle>{t('common.success')}</AlertTitle>
                  <AlertDescription>{t('settings.passwordChanged')}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4">
                <div className="relative">
                  <Label htmlFor="current-password">{t('settings.currentPassword')}</Label>
                  <div className="relative mt-1">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <Label htmlFor="new-password">{t('settings.newPassword')}</Label>
                  <div className="relative mt-1">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{t('settings.passwordRequirements')}</p>
                </div>

                <div>
                  <Label htmlFor="confirm-password">{t('settings.confirmNewPassword')}</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <Button onClick={handlePasswordChange} className="mt-2">
                {t('settings.changePassword')}
              </Button>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">{t('settings.autoLogout')}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="inactivity-timeout">{t('settings.inactivityTimeout')}</Label>
                  <span className="text-sm font-medium">
                    {formatTimeout(inactivityTimeoutValue)}
                  </span>
                </div>
                <Slider
                  id="inactivity-timeout"
                  min={10}
                  max={600}
                  step={10}
                  value={[inactivityTimeoutValue]}
                  onValueChange={handleInactivityTimeoutChange}
                />
                <p className="text-sm text-muted-foreground">
                  {t('settings.inactivityTimeoutDescription')}
                  {t('settings.inactivityTimeoutRange')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle>{t('settings.notifications')}</CardTitle>
            <CardDescription>{t('settings.manageNotificationPreferences')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">{t('settings.pushNotifications')}</Label>
                <p className="text-sm text-muted-foreground">{t('settings.receivePushNotifications')}</p>
              </div>
              <Switch
                id="push-notifications"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>{t('settings.saveSettings')}</Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
