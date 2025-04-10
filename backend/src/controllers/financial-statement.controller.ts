import { Request, Response, NextFunction } from 'express';
import { FinancialStatement } from '../models/financial-statement.model';
import { AppError } from '../utils/appError';
import { generatePDF, generateExcel } from '../utils/exportUtils';

export const financialStatementController = {
  // Get all financial statements
  async getAllFinancialStatements(req: Request, res: Response, next: NextFunction) {
    try {
      const statements = await FinancialStatement.find();
      res.status(200).json({
        status: 'success',
        results: statements.length,
        data: statements
      });
    } catch (error) {
      next(error);
    }
  },

  // Get a single financial statement by ID
  async getFinancialStatement(req: Request, res: Response, next: NextFunction) {
    try {
      const statement = await FinancialStatement.findById(req.params.id);
      if (!statement) {
        return next(new AppError('No financial statement found with that ID', 404));
      }
      res.status(200).json({
        status: 'success',
        data: statement
      });
    } catch (error) {
      next(error);
    }
  },

  // Create a new financial statement
  async createFinancialStatement(req: Request, res: Response, next: NextFunction) {
    try {
      const newStatement = await FinancialStatement.create({
        ...req.body,
        createdBy: req.user?.id || 'system'
      });
      res.status(201).json({
        status: 'success',
        data: newStatement
      });
    } catch (error) {
      next(error);
    }
  },

  // Update a financial statement
  async updateFinancialStatement(req: Request, res: Response, next: NextFunction) {
    try {
      const statement = await FinancialStatement.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );
      if (!statement) {
        return next(new AppError('No financial statement found with that ID', 404));
      }
      res.status(200).json({
        status: 'success',
        data: statement
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete a financial statement
  async deleteFinancialStatement(req: Request, res: Response, next: NextFunction) {
    try {
      const statement = await FinancialStatement.findByIdAndDelete(req.params.id);
      if (!statement) {
        return next(new AppError('No financial statement found with that ID', 404));
      }
      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      next(error);
    }
  },

  // Generate a financial statement
  async generateFinancialStatement(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, periodId, comparisonPeriodId } = req.body;

      if (!type || !periodId) {
        return next(new AppError('Statement type and period ID are required', 400));
      }

      // In a real implementation, this would calculate values based on journal entries
      // For now, we'll create a placeholder statement
      const date = new Date().toISOString().split('T')[0];

      let data: any;

      // Generate appropriate data based on statement type
      switch (type) {
        case 'balance_sheet':
          data = {
            date,
            periodId,
            assets: {
              nonCurrentAssets: {
                code: 'A',
                label: 'ACTIFS NON COURANTS',
                items: [
                  {
                    code: 'A.1',
                    label: 'Immobilisations incorporelles',
                    accounts: ['20'],
                    value: 5000000,
                    previousValue: 4500000
                  },
                  {
                    code: 'A.2',
                    label: 'Immobilisations corporelles',
                    accounts: ['21'],
                    value: 75000000,
                    previousValue: 80000000
                  }
                ],
                total: 80000000,
                previousTotal: 84500000
              },
              currentAssets: {
                code: 'B',
                label: 'ACTIFS COURANTS',
                items: [
                  {
                    code: 'B.1',
                    label: 'Stocks et encours',
                    accounts: ['30', '31', '32', '33', '34', '35', '36', '37', '38'],
                    value: 35000000,
                    previousValue: 30000000
                  },
                  {
                    code: 'B.2',
                    label: 'Créances et emplois assimilés',
                    accounts: ['40', '41', '42', '43', '44', '45', '46', '47', '48'],
                    value: 15000000,
                    previousValue: 18000000
                  }
                ],
                total: 50000000,
                previousTotal: 48000000
              }
            },
            liabilities: {
              equity: {
                code: 'C',
                label: 'CAPITAUX PROPRES',
                items: [
                  {
                    code: 'C.1',
                    label: 'Capital émis',
                    accounts: ['101'],
                    value: 50000000,
                    previousValue: 50000000
                  },
                  {
                    code: 'C.2',
                    label: 'Réserves',
                    accounts: ['106'],
                    value: 10000000,
                    previousValue: 8000000
                  }
                ],
                total: 60000000,
                previousTotal: 58000000
              },
              nonCurrentLiabilities: {
                code: 'D',
                label: 'PASSIFS NON COURANTS',
                items: [
                  {
                    code: 'D.1',
                    label: 'Emprunts et dettes financières',
                    accounts: ['16'],
                    value: 40000000,
                    previousValue: 45000000
                  }
                ],
                total: 40000000,
                previousTotal: 45000000
              },
              currentLiabilities: {
                code: 'E',
                label: 'PASSIFS COURANTS',
                items: [
                  {
                    code: 'E.1',
                    label: 'Fournisseurs et comptes rattachés',
                    accounts: ['40'],
                    value: 12000000,
                    previousValue: 10000000
                  },
                  {
                    code: 'E.2',
                    label: 'Impôts',
                    accounts: ['44'],
                    value: 8000000,
                    previousValue: 7000000
                  },
                  {
                    code: 'E.3',
                    label: 'Autres dettes',
                    accounts: ['41', '42', '43', '45', '46', '47', '48'],
                    value: 10000000,
                    previousValue: 12500000
                  }
                ],
                total: 30000000,
                previousTotal: 29500000
              }
            },
            totalAssets: 130000000,
            totalLiabilities: 130000000,
            previousTotalAssets: 132500000,
            previousTotalLiabilities: 132500000
          };
          break;

        case 'income_statement':
          data = {
            startDate: '2023-01-01',
            endDate: date,
            periodId,
            operatingRevenue: {
              code: 'I',
              label: 'PRODUITS D\'EXPLOITATION',
              items: [
                {
                  code: 'I.1',
                  label: 'Ventes et produits annexes',
                  accounts: ['70'],
                  value: 75000000,
                  previousValue: 65000000
                }
              ],
              total: 75000000,
              previousTotal: 65000000
            },
            operatingExpenses: {
              code: 'II',
              label: 'CHARGES D\'EXPLOITATION',
              items: [
                {
                  code: 'II.1',
                  label: 'Achats consommés',
                  accounts: ['60'],
                  value: 45000000,
                  previousValue: 38000000
                },
                {
                  code: 'II.2',
                  label: 'Charges de personnel',
                  accounts: ['63'],
                  value: 15000000,
                  previousValue: 13000000
                }
              ],
              total: 60000000,
              previousTotal: 51000000
            },
            financialRevenue: {
              code: 'III',
              label: 'PRODUITS FINANCIERS',
              items: [
                {
                  code: 'III.1',
                  label: 'Produits financiers',
                  accounts: ['76'],
                  value: 1000000,
                  previousValue: 800000
                }
              ],
              total: 1000000,
              previousTotal: 800000
            },
            financialExpenses: {
              code: 'IV',
              label: 'CHARGES FINANCIÈRES',
              items: [
                {
                  code: 'IV.1',
                  label: 'Charges financières',
                  accounts: ['66'],
                  value: 2000000,
                  previousValue: 2200000
                }
              ],
              total: 2000000,
              previousTotal: 2200000
            },
            extraordinaryItems: {
              code: 'V',
              label: 'ÉLÉMENTS EXTRAORDINAIRES',
              items: [],
              total: 0,
              previousTotal: 0
            },
            taxes: {
              code: 'VI',
              label: 'IMPÔTS SUR LES RÉSULTATS',
              items: [
                {
                  code: 'VI.1',
                  label: 'Impôts exigibles sur résultats',
                  accounts: ['695'],
                  value: 2500000,
                  previousValue: 1800000
                }
              ],
              total: 2500000,
              previousTotal: 1800000
            },
            operatingResult: 15000000,
            financialResult: -1000000,
            ordinaryResult: 14000000,
            extraordinaryResult: 0,
            netResult: 11500000,
            previousOperatingResult: 14000000,
            previousFinancialResult: -1400000,
            previousOrdinaryResult: 12600000,
            previousExtraordinaryResult: 0,
            previousNetResult: 10800000
          };
          break;

        case 'cash_flow':
          data = {
            startDate: '2023-01-01',
            endDate: date,
            periodId,
            operatingActivities: {
              code: 'A',
              label: 'FLUX DE TRÉSORERIE LIÉS À L\'ACTIVITÉ',
              items: [
                {
                  code: 'A.1',
                  label: 'Résultat net',
                  accounts: ['12'],
                  value: 11500000,
                  previousValue: 10800000
                },
                {
                  code: 'A.2',
                  label: 'Amortissements et provisions',
                  accounts: ['68', '78'],
                  value: 5000000,
                  previousValue: 4500000
                }
              ],
              total: 16500000,
              previousTotal: 15300000
            },
            investingActivities: {
              code: 'B',
              label: 'FLUX DE TRÉSORERIE LIÉS AUX OPÉRATIONS D\'INVESTISSEMENT',
              items: [
                {
                  code: 'B.1',
                  label: 'Acquisitions d\'immobilisations',
                  accounts: ['20', '21', '22', '23', '24', '25', '26', '27', '28'],
                  value: -10000000,
                  previousValue: -15000000
                }
              ],
              total: -10000000,
              previousTotal: -15000000
            },
            financingActivities: {
              code: 'C',
              label: 'FLUX DE TRÉSORERIE LIÉS AUX OPÉRATIONS DE FINANCEMENT',
              items: [
                {
                  code: 'C.1',
                  label: 'Dividendes versés',
                  accounts: ['457'],
                  value: -5000000,
                  previousValue: -4000000
                }
              ],
              total: -5000000,
              previousTotal: -4000000
            },
            netCashFromOperatingActivities: 16500000,
            netCashFromInvestingActivities: -10000000,
            netCashFromFinancingActivities: -5000000,
            netChangeInCash: 1500000,
            openingCashBalance: 20000000,
            closingCashBalance: 21500000,
            previousNetCashFromOperatingActivities: 15300000,
            previousNetCashFromInvestingActivities: -15000000,
            previousNetCashFromFinancingActivities: -4000000,
            previousNetChangeInCash: -3700000,
            previousOpeningCashBalance: 23700000,
            previousClosingCashBalance: 20000000
          };
          break;

        default:
          return next(new AppError('Invalid statement type', 400));
      }

      // Create the financial statement
      const statement = await FinancialStatement.create({
        type,
        periodId,
        date,
        comparisonPeriodId,
        status: 'draft',
        data,
        createdBy: req.user?.id || 'system'
      });

      res.status(201).json({
        status: 'success',
        data: statement
      });
    } catch (error) {
      next(error);
    }
  },

  // Finalize a financial statement
  async finalizeFinancialStatement(req: Request, res: Response, next: NextFunction) {
    try {
      const statement = await FinancialStatement.findById(req.params.id);

      if (!statement) {
        return next(new AppError('No financial statement found with that ID', 404));
      }

      if (statement.status === 'final') {
        return next(new AppError('This statement is already finalized', 400));
      }

      statement.status = 'final';
      await statement.save();

      res.status(200).json({
        status: 'success',
        data: statement
      });
    } catch (error) {
      next(error);
    }
  },

  // Export a financial statement to PDF
  async exportFinancialStatementToPDF(req: Request, res: Response, next: NextFunction) {
    try {
      const statement = await FinancialStatement.findById(req.params.id);

      if (!statement) {
        return next(new AppError('No financial statement found with that ID', 404));
      }

      // Generate PDF (this would be implemented in utils/exportUtils.ts)
      const pdfBuffer = await generatePDF(statement);

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="statement-${statement._id}.pdf"`);

      // Send the PDF
      res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  },

  // Export a financial statement to Excel
  async exportFinancialStatementToExcel(req: Request, res: Response, next: NextFunction) {
    try {
      const statement = await FinancialStatement.findById(req.params.id);

      if (!statement) {
        return next(new AppError('No financial statement found with that ID', 404));
      }

      // Generate Excel (this would be implemented in utils/exportUtils.ts)
      const excelBuffer = await generateExcel(statement);

      // Set response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="statement-${statement._id}.xlsx"`);

      // Send the Excel file
      res.send(excelBuffer);
    } catch (error) {
      next(error);
    }
  }
};
