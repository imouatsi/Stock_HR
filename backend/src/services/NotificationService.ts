import { WebSocketService } from './WebSocketService';
import { User } from '../models/user.model';
import { EmailService } from './EmailService';

export class NotificationService {
  private static instance: NotificationService;
  private ws: WebSocketService;
  private email: EmailService;

  private constructor() {
    this.ws = WebSocketService.getInstance();
    this.email = new EmailService();
  }

  public static getInstance(): NotificationService {
    if (!this.instance) {
      this.instance = new NotificationService();
    }
    return this.instance;
  }

  public async notify(userId: string, notification: any) {
    const user = await User.findById(userId);
    if (!user) return;

    // Real-time notification
    this.ws.sendToUser(userId, 'notification', notification);

    // Email notification if enabled
    if (user.settings?.emailNotifications?.updates) {
      await this.email.sendNotification(user.email, notification);
    }

    // Store notification
    await this.storeNotification(userId, notification);
  }

  public async broadcastToTeam(teamId: string, notification: any) {
    const teamMembers = await User.find({ 'teams.id': teamId });
    
    for (const member of teamMembers) {
      await this.notify(member._id, notification);
    }
  }
}
