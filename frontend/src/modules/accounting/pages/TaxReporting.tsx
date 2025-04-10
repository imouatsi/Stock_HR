import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, FileDown, Calendar, AlertCircle, CheckCircle, Clock, ArrowRight } from 'lucide-react';

const TaxReporting: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('accounting.taxReporting.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('accounting.taxReporting.description')}</p>
      </div>
      
      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">{t('accounting.taxReporting.monthly')}</TabsTrigger>
          <TabsTrigger value="quarterly">{t('accounting.taxReporting.quarterly')}</TabsTrigger>
          <TabsTrigger value="annual">{t('accounting.taxReporting.annual')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monthly" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* G50 Declaration Card */}
            <Card>
              <CardHeader>
                <CardTitle>{t('accounting.taxReporting.g50.title')}</CardTitle>
                <CardDescription>{t('accounting.taxReporting.g50.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{t('accounting.taxReporting.g50.dueDate')}: 20th of each month</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-sm">{t('accounting.taxReporting.g50.includes')}: TVA, TAP, IRG</span>
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                    <span className="text-sm">{t('accounting.taxReporting.g50.requiredFor')}: All businesses</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleNavigate('/accounting/tax-reporting/g50')}>
                  {t('accounting.taxReporting.g50.manage')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
            
            {/* TVA Declaration Card */}
            <Card>
              <CardHeader>
                <CardTitle>{t('accounting.taxReporting.tva.title')}</CardTitle>
                <CardDescription>{t('accounting.taxReporting.tva.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{t('accounting.taxReporting.tva.dueDate')}: 20th of each month</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-sm">{t('accounting.taxReporting.tva.includes')}: Sales, Purchases</span>
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                    <span className="text-sm">{t('accounting.taxReporting.tva.requiredFor')}: VAT registered businesses</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" onClick={() => handleNavigate('/accounting/tax-reporting/tva')}>
                  {t('accounting.taxReporting.tva.manage')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
            
            {/* IRG Salaries Declaration Card */}
            <Card>
              <CardHeader>
                <CardTitle>{t('accounting.taxReporting.irg.title')}</CardTitle>
                <CardDescription>{t('accounting.taxReporting.irg.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{t('accounting.taxReporting.irg.dueDate')}: 20th of each month</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-sm">{t('accounting.taxReporting.irg.includes')}: Salaries, Benefits</span>
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                    <span className="text-sm">{t('accounting.taxReporting.irg.requiredFor')}: Employers</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" onClick={() => handleNavigate('/accounting/tax-reporting/irg')}>
                  {t('accounting.taxReporting.irg.manage')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="quarterly" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Quarterly G50 Declaration Card */}
            <Card>
              <CardHeader>
                <CardTitle>{t('accounting.taxReporting.g50Quarterly.title')}</CardTitle>
                <CardDescription>{t('accounting.taxReporting.g50Quarterly.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{t('accounting.taxReporting.g50Quarterly.dueDate')}: 20th after quarter end</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-sm">{t('accounting.taxReporting.g50Quarterly.includes')}: TVA, TAP, IRG</span>
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                    <span className="text-sm">{t('accounting.taxReporting.g50Quarterly.requiredFor')}: Small businesses</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleNavigate('/accounting/tax-reporting/g50')}>
                  {t('accounting.taxReporting.g50Quarterly.manage')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
            
            {/* IBS Advance Payments Card */}
            <Card>
              <CardHeader>
                <CardTitle>{t('accounting.taxReporting.ibsAdvance.title')}</CardTitle>
                <CardDescription>{t('accounting.taxReporting.ibsAdvance.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{t('accounting.taxReporting.ibsAdvance.dueDate')}: 20th after quarter end</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-sm">{t('accounting.taxReporting.ibsAdvance.includes')}: Corporate tax advances</span>
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                    <span className="text-sm">{t('accounting.taxReporting.ibsAdvance.requiredFor')}: Companies</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" onClick={() => handleNavigate('/accounting/tax-reporting/ibs-advance')}>
                  {t('accounting.taxReporting.ibsAdvance.manage')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="annual" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* IBS Annual Declaration Card */}
            <Card>
              <CardHeader>
                <CardTitle>{t('accounting.taxReporting.ibs.title')}</CardTitle>
                <CardDescription>{t('accounting.taxReporting.ibs.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{t('accounting.taxReporting.ibs.dueDate')}: April 30th</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-sm">{t('accounting.taxReporting.ibs.includes')}: Annual corporate tax</span>
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                    <span className="text-sm">{t('accounting.taxReporting.ibs.requiredFor')}: Companies</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleNavigate('/accounting/tax-reporting/ibs')}>
                  {t('accounting.taxReporting.ibs.manage')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
            
            {/* Annual Summary Declaration Card */}
            <Card>
              <CardHeader>
                <CardTitle>{t('accounting.taxReporting.annualSummary.title')}</CardTitle>
                <CardDescription>{t('accounting.taxReporting.annualSummary.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{t('accounting.taxReporting.annualSummary.dueDate')}: January 31st</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-sm">{t('accounting.taxReporting.annualSummary.includes')}: Clients, suppliers</span>
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                    <span className="text-sm">{t('accounting.taxReporting.annualSummary.requiredFor')}: All businesses</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" onClick={() => handleNavigate('/accounting/tax-reporting/annual-summary')}>
                  {t('accounting.taxReporting.annualSummary.manage')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
            
            {/* DAS (Annual Salary Declaration) Card */}
            <Card>
              <CardHeader>
                <CardTitle>{t('accounting.taxReporting.das.title')}</CardTitle>
                <CardDescription>{t('accounting.taxReporting.das.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{t('accounting.taxReporting.das.dueDate')}: January 31st</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-sm">{t('accounting.taxReporting.das.includes')}: Annual salary summary</span>
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                    <span className="text-sm">{t('accounting.taxReporting.das.requiredFor')}: Employers</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" onClick={() => handleNavigate('/accounting/tax-reporting/das')}>
                  {t('accounting.taxReporting.das.manage')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t('accounting.taxReporting.upcomingDeadlines')}</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-amber-500" />
                  <div>
                    <p className="font-medium">{t('accounting.taxReporting.g50.title')} - {new Date().toLocaleString('default', { month: 'long' })} 2023</p>
                    <p className="text-sm text-muted-foreground">{t('accounting.taxReporting.dueIn')} 5 {t('accounting.taxReporting.days')}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleNavigate('/accounting/tax-reporting/g50')}>
                  {t('accounting.taxReporting.prepare')}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-amber-500" />
                  <div>
                    <p className="font-medium">{t('accounting.taxReporting.tva.title')} - {new Date().toLocaleString('default', { month: 'long' })} 2023</p>
                    <p className="text-sm text-muted-foreground">{t('accounting.taxReporting.dueIn')} 5 {t('accounting.taxReporting.days')}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleNavigate('/accounting/tax-reporting/tva')}>
                  {t('accounting.taxReporting.prepare')}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-green-500" />
                  <div>
                    <p className="font-medium">{t('accounting.taxReporting.ibsAdvance.title')} - Q2 2023</p>
                    <p className="text-sm text-muted-foreground">{t('accounting.taxReporting.dueIn')} 15 {t('accounting.taxReporting.days')}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleNavigate('/accounting/tax-reporting/ibs-advance')}>
                  {t('accounting.taxReporting.prepare')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaxReporting;
