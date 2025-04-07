import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RootState } from '@/features/store';
import { updateSettings, setLoading } from '@/features/slices/settingsSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '../../../hooks/useTranslation';

const settingsSchema = z.object({
  language: z.string(),
  theme: z.enum(['light', 'dark']),
  currency: z.string(),
  dateFormat: z.string(),
  timeFormat: z.string(),
  notifications: z.object({
    email: z.object({
      security: z.boolean(),
      updates: z.boolean(),
      marketing: z.boolean(),
    }),
    browser: z.boolean(),
    sound: z.boolean(),
    desktop: z.boolean(),
  }),
  autoLogout: z.number().min(1).max(1440),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
];

const currencies = [
  { code: 'DZD', symbol: 'د.ج', name: 'Dinar Algérien' },
];

const dateFormats = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
];

const timeFormats = [
  { value: '12h', label: '12-hour (AM/PM)' },
  { value: '24h', label: '24-hour' },
];

export function Settings() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { settings, isLoading } = useSelector((state: RootState) => state.settings);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      ...settings,
      currency: 'DZD', // Force DZD as default
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    try {
      dispatch(setLoading(true));
      await dispatch(updateSettings(data)).unwrap();
      // Reload the page to apply language changes if the language was changed
      if (data.language !== settings.language) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="language">{t('settings.language')}</Label>
                <Controller
                  name="language"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder={t('settings.selectLanguage')} />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">{t('settings.currency')}</Label>
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value="DZD"
                      onValueChange={field.onChange}
                      disabled
                    >
                      <SelectTrigger id="currency">
                        <SelectValue>Dinar Algérien (د.ج)</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((curr) => (
                          <SelectItem key={curr.code} value={curr.code}>
                            {curr.name} ({curr.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFormat">{t('settings.dateFormat')}</Label>
                <Controller
                  name="dateFormat"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="dateFormat">
                        <SelectValue placeholder={t('settings.selectDateFormat')} />
                      </SelectTrigger>
                      <SelectContent>
                        {dateFormats.map((format) => (
                          <SelectItem key={format.value} value={format.value}>
                            {format.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeFormat">{t('settings.timeFormat')}</Label>
                <Controller
                  name="timeFormat"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="timeFormat">
                        <SelectValue placeholder={t('settings.selectTimeFormat')} />
                      </SelectTrigger>
                      <SelectContent>
                        {timeFormats.map((format) => (
                          <SelectItem key={format.value} value={format.value}>
                            {format.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('settings.notifications')}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications.email.security">{t('settings.securityAlerts')}</Label>
                  <Controller
                    name="notifications.email.security"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="notifications.email.security"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications.email.updates">{t('settings.updates')}</Label>
                  <Controller
                    name="notifications.email.updates"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="notifications.email.updates"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications.email.marketing">{t('settings.marketing')}</Label>
                  <Controller
                    name="notifications.email.marketing"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="notifications.email.marketing"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications.browser">{t('settings.browserNotifications')}</Label>
                  <Controller
                    name="notifications.browser"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="notifications.browser"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications.sound">{t('settings.soundNotifications')}</Label>
                  <Controller
                    name="notifications.sound"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="notifications.sound"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications.desktop">{t('settings.desktopNotifications')}</Label>
                  <Controller
                    name="notifications.desktop"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="notifications.desktop"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="autoLogout">{t('settings.autoLogout')}</Label>
              <Controller
                name="autoLogout"
                control={control}
                render={({ field }) => (
                  <Input
                    id="autoLogout"
                    type="number"
                    min={1}
                    max={1440}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              {errors.autoLogout && (
                <p className="text-sm text-red-500">{errors.autoLogout.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t('common.saving') : t('common.save')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}