import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES, PERMISSIONS } from '../../frontend/src/config';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: keyof typeof ROLES;
  permissions: Array<keyof typeof PERMISSIONS>;
  active: boolean;
  lastLogin?: Date;
  phoneNumber?: string;
  avatar?: string;
  preferences: {
    language: 'en' | 'fr' | 'ar';
    theme: 'light' | 'dark';
    notifications: boolean;
    twoFactorEnabled: boolean;
  };
  securityQuestions?: Array<{
    question: string;
    answer: string;
  }>;
  loginAttempts: number;
  lockUntil?: Date;
  webauthnKeys?: Array<{
    credentialId: string;
    publicKey: string;
    counter: number;
  }>;
  sessions: Array<{
    token: string;
    device: string;
    ip: string;
    lastUsed: Date;
    expiresAt: Date;
    location?: {
      country: string;
      city: string;
      coordinates: [number, number]
    };
    userAgent: string;
  }>;
  mfa: {
    enabled: boolean;
    secret?: string;
    backupCodes: string[];
    recoveryEmail?: string;
  };
  auditLog: Array<{
    action: string;
    timestamp: Date;
    ip: string;
    userAgent: string;
    details: Record<string, any>;
  }>;
  settings: {
    emailNotifications: {
      security: boolean;
      updates: boolean;
      marketing: boolean;
    };
    accessibility: {
      fontSize: 'small' | 'medium' | 'large';
      contrast: 'normal' | 'high';
      animations: boolean;
    };
    workspace: {
      defaultView: 'grid' | 'list';
      defaultLanguage: 'en' | 'fr' | 'ar';
      startPage: string;
      recentItems: string[];
      favorites: string[];
      customShortcuts: Array<{
        name: string;
        path: string;
        icon: string;
      }>;
      analytics: {
        mostUsedFeatures: Array<{
          feature: string;
          useCount: number;
          lastUsed: Date;
        }>;
        productivityScore: number;
        activeHours: {
          start: string;
          end: string;
          timezone: string;
        };
        collaborationStats: {
          teamInteractions: number;
          sharedDocuments: number;
          meetings: number;
          teamScore: number;
          recentCollaborators: string[];
          contributionTrend: 'increasing' | 'stable' | 'decreasing';
        };
        kpis: {
          dailyTasks: {
            completed: number;
            total: number;
            efficiency: number;
          };
          projectProgress: {
            onTrack: number;
            delayed: number;
            completed: number;
          };
          timeTracking: {
            productive: number;
            meetings: number;
            breaks: number;
          };
          performance: {
            qualityScore: number;
            velocityTrend: number[];
            consistencyIndex: number;
            impactScore: number;
            aiPredictions: {
              nextMonthPerformance: number;
              burnoutRisk: 'low' | 'medium' | 'high';
              recommendedActions: string[];
            };
            skillMatrix: {
              technical: Array<{
                skill: string;
                level: number;
                lastAssessed: Date;
                growth: number;
                endorsements: number;
              }>;
              soft: Array<{
                skill: string;
                score: number;
                feedback: string[];
              }>;
              certifications: Array<{
                name: string;
                issuer: string;
                earnedDate: Date;
                expiryDate?: Date;
                score?: number;
              }>;
            };
            learningMetrics: {
              coursesCompleted: number;
              learningHours: number;
              skillsAcquired: string[];
              learningPath: {
                current: string;
                progress: number;
                nextMilestone: string;
                estimatedCompletion: Date;
              };
            };
            goals: {
              current: Array<{
                id: string;
                metric: string;
                target: number;
                progress: number;
                deadline: Date;
                priority: 'low' | 'medium' | 'high';
              }>;
              history: Array<{
                id: string;
                metric: string;
                target: number;
                achieved: number;
                completedAt: Date;
                streak: number;
              }>;
            };
          };
          teamMetrics: {
            synergy: number;
            responseTime: number;
            collaborationIndex: number;
            teamVelocity: {
              current: number;
              trend: number[];
              bottlenecks: string[];
              improvements: string[];
            };
            crossTeamCollaboration: {
              score: number;
              activeCollaborations: number;
              successfulProjects: number;
            };
            projectDelivery: {
              onTimeDelivery: number;
              qualityScore: number;
              teamSatisfaction: number;
              clientFeedback: Array<{
                score: number;
                comment: string;
                date: Date;
              }>;
            };
            skillDistribution: {
              coverage: Record<string, number>;
              gaps: string[];
              recommendations: string[];
            };
          };
        };
        gamification: {
          level: number;
          experience: number;
          rank: string;
          streak: {
            current: number;
            longest: number;
            lastActive: Date;
          };
          badges: Array<{
            id: string;
            name: string;
            earnedAt: Date;
            category: 'achievement' | 'skill' | 'contribution';
          }>;
          achievements: Array<{
            id: string;
            name: string;
            description: string;
            earnedAt: Date;
            rarity: 'common' | 'rare' | 'epic' | 'legendary';
            category: 'achievement' | 'skill' | 'contribution' | 'team';
            icon: string;
          }>;
          challenges: Array<{
            id: string;
            progress: number;
            deadline: Date;
            reward: {
              type: 'badge' | 'points' | 'feature';
              value: string | number;
            };
          }>;
          rewards: {
            availablePoints: number;
            lifetime: number;
            history: Array<{
              id: string;
              type: 'earn' | 'spend';
              amount: number;
              reason: string;
              date: Date;
            }>;
            redemptions: Array<{
              id: string;
              reward: string;
              cost: number;
              date: Date;
              status: 'pending' | 'completed' | 'expired';
            }>;
          };
        };
        reports: {
          scheduled: Array<{
            id: string;
            name: string;
            frequency: 'daily' | 'weekly' | 'monthly';
            recipients: string[];
            metrics: string[];
            lastSent: Date;
          }>;
          templates: Array<{
            id: string;
            name: string;
            format: 'pdf' | 'excel' | 'dashboard';
            widgets: Array<{
              type: string;
              config: Record<string, any>;
              position: { x: number; y: number };
            }>;
          }>;
        };
      };
      projectManagement: {
        activeProjects: Array<{
          id: string;
          role: 'owner' | 'manager' | 'member';
          tasks: Array<{
            id: string;
            status: 'todo' | 'in_progress' | 'review' | 'done';
            priority: 'low' | 'medium' | 'high' | 'urgent';
            timeSpent: number;
          }>;
          milestones: Array<{
            id: string;
            status: 'pending' | 'completed';
            dueDate: Date;
          }>;
        }>;
        taskViews: {
          defaultGrouping: 'status' | 'priority' | 'project' | 'assignee';
          filters: Array<{
            field: string;
            operator: 'equals' | 'contains' | 'greater' | 'less';
            value: any;
          }>;
          savedLayouts: Array<{
            id: string;
            name: string;
            config: Record<string, any>;
          }>;
        };
      };
    };
    communication: {
      preferredChannel: 'email' | 'sms' | 'push';
      availabilityStatus: 'online' | 'away' | 'busy' | 'offline';
      autoReply: {
        enabled: boolean;
        message: string;
        startDate?: Date;
        endDate?: Date;
      };
    };
  };
  subscription: {
    plan: 'free' | 'basic' | 'premium' | 'enterprise';
    status: 'active' | 'expired' | 'cancelled' | 'trial';
    startDate: Date;
    endDate?: Date;
    features: string[];
    usage: {
      storage: number;
      apiCalls: number;
      lastReset: Date;
    };
  };
  organization?: mongoose.Types.ObjectId;
  supervisor?: mongoose.Types.ObjectId;
  department?: string;
  position?: string;
  employmentDate?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  incLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
}

const userSchema = new Schema<IUser>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true 
  },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { 
    type: String,
    enum: Object.keys(ROLES),
    required: true 
  },
  permissions: [{ 
    type: String,
    enum: Object.keys(PERMISSIONS)
  }],
  active: { type: Boolean, default: true },
  lastLogin: Date,
  phoneNumber: { 
    type: String,
    validate: {
      validator: (v: string) => /^\+?[\d\s-]{8,}$/.test(v),
      message: 'Invalid phone number format'
    }
  },
  avatar: String,
  preferences: {
    language: { type: String, enum: ['en', 'fr', 'ar'], default: 'en' },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    notifications: { type: Boolean, default: true },
    twoFactorEnabled: { type: Boolean, default: false }
  },
  securityQuestions: [{
    question: String,
    answer: String
  }],
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  webauthnKeys: [{
    credentialId: String,
    publicKey: String,
    counter: Number
  }],
  sessions: [{
    token: String,
    device: String,
    ip: String,
    lastUsed: Date,
    expiresAt: Date,
    location: {
      country: String,
      city: String,
      coordinates: [Number]
    },
    userAgent: String
  }],
  mfa: {
    enabled: { type: Boolean, default: false },
    secret: String,
    backupCodes: [String],
    recoveryEmail: String
  },
  auditLog: [{
    action: String,
    timestamp: { type: Date, default: Date.now },
    ip: String,
    userAgent: String,
    details: Schema.Types.Mixed
  }],
  settings: {
    emailNotifications: {
      security: { type: Boolean, default: true },
      updates: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false }
    },
    accessibility: {
      fontSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
      contrast: { type: String, enum: ['normal', 'high'], default: 'normal' },
      animations: { type: Boolean, default: true }
    },
    workspace: {
      defaultView: { type: String, enum: ['grid', 'list'], default: 'grid' },
      defaultLanguage: { type: String, enum: ['en', 'fr', 'ar'], default: 'en' },
      startPage: { type: String, default: '/' },
      recentItems: [String],
      favorites: [String],
      customShortcuts: [{
        name: String,
        path: String,
        icon: String
      }],
      analytics: {
        mostUsedFeatures: [{
          feature: String,
          useCount: Number,
          lastUsed: Date
        }],
        productivityScore: Number,
        activeHours: {
          start: String,
          end: String,
          timezone: String
        },
        collaborationStats: {
          teamInteractions: Number,
          sharedDocuments: Number,
          meetings: Number,
          teamScore: Number,
          recentCollaborators: [String],
          contributionTrend: { type: String, enum: ['increasing', 'stable', 'decreasing'] }
        },
        kpis: {
          dailyTasks: {
            completed: Number,
            total: Number,
            efficiency: Number
          },
          projectProgress: {
            onTrack: Number,
            delayed: Number,
            completed: Number
          },
          timeTracking: {
            productive: Number,
            meetings: Number,
            breaks: Number
          },
          performance: {
            qualityScore: Number,
            velocityTrend: [Number],
            consistencyIndex: Number,
            impactScore: Number,
            aiPredictions: {
              nextMonthPerformance: Number,
              burnoutRisk: { type: String, enum: ['low', 'medium', 'high'] },
              recommendedActions: [String]
            },
            skillMatrix: {
              technical: [{
                skill: String,
                level: Number,
                lastAssessed: Date,
                growth: Number,
                endorsements: Number
              }],
              soft: [{
                skill: String,
                score: Number,
                feedback: [String]
              }],
              certifications: [{
                name: String,
                issuer: String,
                earnedDate: Date,
                expiryDate: Date,
                score: Number
              }]
            },
            learningMetrics: {
              coursesCompleted: Number,
              learningHours: Number,
              skillsAcquired: [String],
              learningPath: {
                current: String,
                progress: Number,
                nextMilestone: String,
                estimatedCompletion: Date
              }
            },
            goals: {
              current: [{
                id: String,
                metric: String,
                target: Number,
                progress: Number,
                deadline: Date,
                priority: { type: String, enum: ['low', 'medium', 'high'] }
              }],
              history: [{
                id: String,
                metric: String,
                target: Number,
                achieved: Number,
                completedAt: Date,
                streak: Number
              }]
            }
          },
          teamMetrics: {
            synergy: Number,
            responseTime: Number,
            collaborationIndex: Number,
            teamVelocity: {
              current: Number,
              trend: [Number],
              bottlenecks: [String],
              improvements: [String]
            },
            crossTeamCollaboration: {
              score: Number,
              activeCollaborations: Number,
              successfulProjects: Number
            },
            projectDelivery: {
              onTimeDelivery: Number,
              qualityScore: Number,
              teamSatisfaction: Number,
              clientFeedback: [{
                score: Number,
                comment: String,
                date: Date
              }]
            },
            skillDistribution: {
              coverage: Schema.Types.Mixed,
              gaps: [String],
              recommendations: [String]
            }
          }
        },
        gamification: {
          level: Number,
          experience: Number,
          rank: String,
          streak: {
            current: Number,
            longest: Number,
            lastActive: Date
          },
          badges: [{
            id: String,
            name: String,
            earnedAt: Date,
            category: { type: String, enum: ['achievement', 'skill', 'contribution'] }
          }],
          achievements: [{
            id: String,
            name: String,
            description: String,
            earnedAt: Date,
            rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'] },
            category: { type: String, enum: ['achievement', 'skill', 'contribution', 'team'] },
            icon: String
          }],
          challenges: [{
            id: String,
            progress: Number,
            deadline: Date,
            reward: {
              type: { type: String, enum: ['badge', 'points', 'feature'] },
              value: Schema.Types.Mixed
            }
          }],
          rewards: {
            availablePoints: Number,
            lifetime: Number,
            history: [{
              id: String,
              type: { type: String, enum: ['earn', 'spend'] },
              amount: Number,
              reason: String,
              date: Date
            }],
            redemptions: [{
              id: String,
              reward: String,
              cost: Number,
              date: Date,
              status: { type: String, enum: ['pending', 'completed', 'expired'] }
            }]
          }
        },
        reports: {
          scheduled: [{
            id: String,
            name: String,
            frequency: { type: String, enum: ['daily', 'weekly', 'monthly'] },
            recipients: [String],
            metrics: [String],
            lastSent: Date
          }],
          templates: [{
            id: String,
            name: String,
            format: { type: String, enum: ['pdf', 'excel', 'dashboard'] },
            widgets: [{
              type: String,
              config: Schema.Types.Mixed,
              position: { x: Number, y: Number }
            }]
          }]
        }
      },
      projectManagement: {
        activeProjects: [{
          id: String,
          role: { type: String, enum: ['owner', 'manager', 'member'] },
          tasks: [{
            id: String,
            status: { type: String, enum: ['todo', 'in_progress', 'review', 'done'] },
            priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'] },
            timeSpent: Number
          }],
          milestones: [{
            id: String,
            status: { type: String, enum: ['pending', 'completed'] },
            dueDate: Date
          }]
        }],
        taskViews: {
          defaultGrouping: { type: String, enum: ['status', 'priority', 'project', 'assignee'] },
          filters: [{
            field: String,
            operator: { type: String, enum: ['equals', 'contains', 'greater', 'less'] },
            value: Schema.Types.Mixed
          }],
          savedLayouts: [{
            id: String,
            name: String,
            config: Schema.Types.Mixed
          }]
        }
      }
    },
    communication: {
      preferredChannel: { type: String, enum: ['email', 'sms', 'push'], default: 'email' },
      availabilityStatus: { type: String, enum: ['online', 'away', 'busy', 'offline'], default: 'online' },
      autoReply: {
        enabled: { type: Boolean, default: false },
        message: String,
        startDate: Date,
        endDate: Date
      }
    }
  },
  subscription: {
    plan: { type: String, enum: ['free', 'basic', 'premium', 'enterprise'], default: 'free' },
    status: { type: String, enum: ['active', 'expired', 'cancelled', 'trial'], default: 'active' },
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    features: [String],
    usage: {
      storage: { type: Number, default: 0 },
      apiCalls: { type: Number, default: 0 },
      lastReset: { type: Date, default: Date.now }
    }
  },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },
  supervisor: { type: Schema.Types.ObjectId, ref: 'User' },
  department: String,
  position: String,
  employmentDate: Date
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.incLoginAttempts = async function(): Promise<void> {
  this.loginAttempts += 1;
  if (this.loginAttempts >= 5) {
    this.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
  }
  await this.save();
};

userSchema.methods.resetLoginAttempts = async function(): Promise<void> {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  await this.save();
};

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ 'preferences.language': 1 });

export default mongoose.model<IUser>('User', userSchema);