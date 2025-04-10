import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { taxReportingService } from '@/services/taxReportingService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { G50Declaration, TaxPeriod, G50TaxSection } from '@/types/tax-reporting';
import { FileDown, FileText, FilePlus, Eye, CheckCircle, AlertCircle, Download, Printer } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const G50DeclarationPage: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [declarations, setDeclarations] = useState<G50Declaration[]>([]);
  const [periods, setPeriods] = useState<TaxPeriod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDeclaration, setSelectedDeclaration] = useState<G50Declaration | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  // Form state for generating a new declaration
  const [formData, setFormData] = useState({
    periodId: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [declarationsData, periodsData] = await Promise.all([
        taxReportingService.getAllG50Declarations(),
        taxReportingService.getAllTaxPeriods()
      ]);
      
      setDeclarations(declarationsData);
      setPeriods(periodsData.filter(p => p.type === 'monthly' || p.type === 'quarterly'));
      
      // Set default period if available
      if (periodsData.length > 0) {
        const currentPeriod = periodsData.find(p => !p.isClosed && (p.type === 'monthly' || p.type === 'quarterly'));
        if (currentPeriod) {
          setFormData(prev => ({
            ...prev,
            periodId: currentPeriod._id || ''
          }));
        }
      }
    } catch (error) {
      toast({
        title: t('common.error.title'),
        description: t('accounting.taxReporting.error.loading'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-DZ');
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Handle opening the generate declaration dialog
  const handleGenerateDeclaration = () => {
    setIsDialogOpen(true);
  };
  
  // Handle form input changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle generating a G50 declaration
  const handleSubmitGenerate = async () => {
    try {
      setIsGenerating(true);
      
      const { periodId } = formData;
      
      if (!periodId) {
        toast({
          title: t('common.error.title'),
          description: t('accounting.taxReporting.error.missingFields'),
          variant: 'destructive',
        });
        return;
      }
      
      const result = await taxReportingService.generateG50Declaration(periodId);
      
      // Add the new declaration to the list
      setDeclarations(prev => [result, ...prev]);
      
      // Close the dialog
      setIsDialogOpen(false);
      
      toast({
        title: t('common.success'),
        description: t('accounting.taxReporting.success.generated'),
      });
    } catch (error) {
      toast({
        title: t('common.error.title'),
        description: t('accounting.taxReporting.error.generating'),
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle viewing a G50 declaration
  const handleViewDeclaration = async (id: string) => {
    try {
      setIsLoading(true);
      const declaration = await taxReportingService.getG50DeclarationById(id);
      if (declaration) {
        setSelectedDeclaration(declaration);
        setViewDialogOpen(true);
      }
    } catch (error) {
      toast({
        title: t('common.error.title'),
        description: t('accounting.taxReporting.error.loading'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle submitting a G50 declaration
  const handleSubmitDeclaration = async (id: string) => {
    try {
      setIsLoading(true);
      const updatedDeclaration = await taxReportingService.submitG50Declaration(id);
      
      // Update the declaration in the list
      setDeclarations(prev => prev.map(d => d._id === id ? updatedDeclaration : d));
      
      // Update the selected declaration if it's the one being viewed
      if (selectedDeclaration && selectedDeclaration._id === id) {
        setSelectedDeclaration(updatedDeclaration);
      }
      
      toast({
        title: t('common.success'),
        description: t('accounting.taxReporting.success.submitted'),
      });
    } catch (error) {
      toast({
        title: t('common.error.title'),
        description: t('accounting.taxReporting.error.submitting'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle exporting a G50 declaration to PDF
  const handleExportToPDF = async (id: string) => {
    try {
      const pdfUrl = await taxReportingService.exportG50Declaration(id, 'pdf');
      window.open(pdfUrl, '_blank');
      
      toast({
        title: t('common.success'),
        description: t('accounting.taxReporting.success.exported'),
      });
    } catch (error) {
      toast({
        title: t('common.error.title'),
        description: t('accounting.taxReporting.error.exporting'),
        variant: 'destructive',
      });
    }
  };
  
  // Handle exporting a G50 declaration to Excel
  const handleExportToExcel = async (id: string) => {
    try {
      const excelUrl = await taxReportingService.exportG50Declaration(id, 'excel');
      window.open(excelUrl, '_blank');
      
      toast({
        title: t('common.success'),
        description: t('accounting.taxReporting.success.exported'),
      });
    } catch (error) {
      toast({
        title: t('common.error.title'),
        description: t('accounting.taxReporting.error.exporting'),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('accounting.taxReporting.g50.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('accounting.taxReporting.g50.description')}</p>
        </div>
        <Button onClick={handleGenerateDeclaration}>
          <FilePlus className="h-4 w-4 mr-2" />
          {t('accounting.taxReporting.g50.generateDeclaration')}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('accounting.taxReporting.g50.number')}</TableHead>
                <TableHead>{t('accounting.taxReporting.g50.period')}</TableHead>
                <TableHead>{t('accounting.taxReporting.g50.submissionDate')}</TableHead>
                <TableHead>{t('accounting.taxReporting.g50.dueDate')}</TableHead>
                <TableHead className="text-right">{t('accounting.taxReporting.g50.amount')}</TableHead>
                <TableHead>{t('accounting.taxReporting.g50.status')}</TableHead>
                <TableHead className="text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {declarations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    {t('common.noData')}
                  </TableCell>
                </TableRow>
              ) : (
                declarations.map((declaration) => (
                  <TableRow key={declaration._id}>
                    <TableCell>{declaration.declarationNumber}</TableCell>
                    <TableCell>{declaration.periodName || declaration.periodId}</TableCell>
                    <TableCell>{formatDate(declaration.submissionDate)}</TableCell>
                    <TableCell>{formatDate(declaration.dueDate)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(declaration.totalAmount)}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          declaration.status === 'submitted' ? 'bg-green-100 text-green-800' :
                          declaration.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                          declaration.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {t(`accounting.taxReporting.g50.status.${declaration.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDeclaration(declaration._id || '')}
                          title={t('common.view')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {declaration.status === 'draft' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSubmitDeclaration(declaration._id || '')}
                            title={t('accounting.taxReporting.g50.submit')}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleExportToPDF(declaration._id || '')}
                          title={t('accounting.taxReporting.g50.exportPDF')}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleExportToExcel(declaration._id || '')}
                          title={t('accounting.taxReporting.g50.exportExcel')}
                        >
                          <FileDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Generate Declaration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('accounting.taxReporting.g50.generateDeclaration')}</DialogTitle>
            <DialogDescription>
              {t('accounting.taxReporting.g50.generateDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="periodId">{t('accounting.taxReporting.g50.period')}</Label>
              <Select
                value={formData.periodId}
                onValueChange={(value) => handleSelectChange('periodId', value)}
              >
                <SelectTrigger id="periodId">
                  <SelectValue placeholder={t('accounting.taxReporting.g50.selectPeriod')} />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((period) => (
                    <SelectItem 
                      key={period._id} 
                      value={period._id || ''}
                      disabled={period.isClosed}
                    >
                      {period.name} {period.isClosed && `(${t('accounting.accountingPeriods.closed')})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">{t('accounting.taxReporting.g50.periodDescription')}</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSubmitGenerate} disabled={isGenerating}>
              {isGenerating ? t('common.generating') : t('common.generate')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Declaration Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>
              {t('accounting.taxReporting.g50.declarationDetails')}
            </DialogTitle>
            <DialogDescription>
              {selectedDeclaration?.declarationNumber} - {selectedDeclaration?.periodName || ''}
            </DialogDescription>
          </DialogHeader>
          
          {selectedDeclaration && (
            <div className="py-4">
              <Tabs defaultValue="declaration">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="declaration">{t('accounting.taxReporting.g50.declaration')}</TabsTrigger>
                  <TabsTrigger value="details">{t('accounting.taxReporting.g50.details')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="declaration" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('accounting.taxReporting.g50.companyInfo')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">{t('accounting.taxReporting.g50.companyName')}:</p>
                          <p>{selectedDeclaration.companyInfo.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t('accounting.taxReporting.g50.taxId')}:</p>
                          <p>{selectedDeclaration.companyInfo.taxId}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t('accounting.taxReporting.g50.taxRegistrationNumber')}:</p>
                          <p>{selectedDeclaration.companyInfo.taxRegistrationNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t('accounting.taxReporting.g50.activityCode')}:</p>
                          <p>{selectedDeclaration.companyInfo.activityCode}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t('accounting.taxReporting.g50.address')}:</p>
                          <p>{selectedDeclaration.companyInfo.address}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t('accounting.taxReporting.g50.municipality')} / {t('accounting.taxReporting.g50.wilaya')}:</p>
                          <p>{selectedDeclaration.companyInfo.municipality}, {selectedDeclaration.companyInfo.wilaya}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('accounting.taxReporting.g50.taxSections')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t('accounting.taxReporting.g50.code')}</TableHead>
                            <TableHead>{t('accounting.taxReporting.g50.name')}</TableHead>
                            <TableHead>{t('accounting.taxReporting.g50.taxType')}</TableHead>
                            <TableHead className="text-right">{t('accounting.taxReporting.g50.taxableAmount')}</TableHead>
                            <TableHead className="text-right">{t('accounting.taxReporting.g50.taxRate')}</TableHead>
                            <TableHead className="text-right">{t('accounting.taxReporting.g50.taxAmount')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedDeclaration.taxSections.map((section, index) => (
                            <TableRow key={index}>
                              <TableCell>{section.code}</TableCell>
                              <TableCell>{section.name}</TableCell>
                              <TableCell>{section.taxType}</TableCell>
                              <TableCell className="text-right font-mono">{formatCurrency(section.taxableAmount)}</TableCell>
                              <TableCell className="text-right">{section.taxRate}%</TableCell>
                              <TableCell className="text-right font-mono">{formatCurrency(section.taxAmount)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="font-bold bg-muted">
                            <TableCell colSpan={5} className="text-right">{t('accounting.taxReporting.g50.totalAmount')}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency(selectedDeclaration.totalAmount)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  
                  {selectedDeclaration.status !== 'draft' && (
                    <Card>
                      <CardHeader>
                        <CardTitle>{t('accounting.taxReporting.g50.paymentInfo')}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm font-medium">{t('accounting.taxReporting.g50.paymentMethod')}:</p>
                            <p>{selectedDeclaration.paymentMethod}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{t('accounting.taxReporting.g50.paymentReference')}:</p>
                            <p>{selectedDeclaration.paymentReference}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{t('accounting.taxReporting.g50.paymentDate')}:</p>
                            <p>{selectedDeclaration.paymentDate ? formatDate(selectedDeclaration.paymentDate) : '-'}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="details">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('accounting.taxReporting.g50.declarationDetails')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">{t('accounting.taxReporting.g50.number')}:</p>
                          <p>{selectedDeclaration.declarationNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t('accounting.taxReporting.g50.period')}:</p>
                          <p>{selectedDeclaration.periodName || selectedDeclaration.periodId}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t('accounting.taxReporting.g50.periodType')}:</p>
                          <p>{t(`accounting.taxReporting.g50.periodType.${selectedDeclaration.periodType}`)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t('accounting.taxReporting.g50.year')}:</p>
                          <p>{selectedDeclaration.year}</p>
                        </div>
                        {selectedDeclaration.month && (
                          <div>
                            <p className="text-sm font-medium">{t('accounting.taxReporting.g50.month')}:</p>
                            <p>{selectedDeclaration.month}</p>
                          </div>
                        )}
                        {selectedDeclaration.quarter && (
                          <div>
                            <p className="text-sm font-medium">{t('accounting.taxReporting.g50.quarter')}:</p>
                            <p>{selectedDeclaration.quarter}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium">{t('accounting.taxReporting.g50.submissionDate')}:</p>
                          <p>{formatDate(selectedDeclaration.submissionDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t('accounting.taxReporting.g50.dueDate')}:</p>
                          <p>{formatDate(selectedDeclaration.dueDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t('accounting.taxReporting.g50.status')}:</p>
                          <p>
                            <Badge
                              className={
                                selectedDeclaration.status === 'submitted' ? 'bg-green-100 text-green-800' :
                                selectedDeclaration.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                                selectedDeclaration.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }
                            >
                              {t(`accounting.taxReporting.g50.status.${selectedDeclaration.status}`)}
                            </Badge>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t('accounting.taxReporting.g50.createdBy')}:</p>
                          <p>{selectedDeclaration.createdBy}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t('accounting.taxReporting.g50.createdAt')}:</p>
                          <p>{selectedDeclaration.createdAt ? new Date(selectedDeclaration.createdAt).toLocaleString('fr-DZ') : ''}</p>
                        </div>
                        {selectedDeclaration.submittedAt && (
                          <div>
                            <p className="text-sm font-medium">{t('accounting.taxReporting.g50.submittedAt')}:</p>
                            <p>{new Date(selectedDeclaration.submittedAt).toLocaleString('fr-DZ')}</p>
                          </div>
                        )}
                        {selectedDeclaration.submittedBy && (
                          <div>
                            <p className="text-sm font-medium">{t('accounting.taxReporting.g50.submittedBy')}:</p>
                            <p>{selectedDeclaration.submittedBy}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          <DialogFooter>
            <div className="flex space-x-2">
              {selectedDeclaration?.status === 'draft' && (
                <Button onClick={() => handleSubmitDeclaration(selectedDeclaration._id || '')}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {t('accounting.taxReporting.g50.submit')}
                </Button>
              )}
              
              <Button variant="outline" onClick={() => handleExportToPDF(selectedDeclaration?._id || '')}>
                <FileText className="h-4 w-4 mr-2" />
                {t('accounting.taxReporting.g50.exportPDF')}
              </Button>
              
              <Button variant="outline" onClick={() => handleExportToExcel(selectedDeclaration?._id || '')}>
                <FileDown className="h-4 w-4 mr-2" />
                {t('accounting.taxReporting.g50.exportExcel')}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default G50DeclarationPage;
