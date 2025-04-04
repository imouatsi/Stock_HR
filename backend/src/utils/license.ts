import crypto from 'crypto';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class LicenseManager {
  private static instance: LicenseManager;
  private constructor() {}

  public static getInstance(): LicenseManager {
    if (!LicenseManager.instance) {
      LicenseManager.instance = new LicenseManager();
    }
    return LicenseManager.instance;
  }

  async getHardwareId(): Promise<string> {
    try {
      const { stdout: mbSerial } = await execAsync('wmic baseboard get serialnumber');
      const { stdout: hddSerial } = await execAsync('wmic diskdrive get serialnumber');
      
      const hardwareId = crypto
        .createHash('sha256')
        .update(`${mbSerial}${hddSerial}`)
        .digest('hex');
      
      return hardwareId;
    } catch (error) {
      throw new Error('Failed to get hardware ID');
    }
  }

  generateActivationKey(hardwareId: string): string {
    return crypto
      .createHmac('sha256', process.env.LICENSE_SECRET_KEY || 'default-secret')
      .update(hardwareId)
      .digest('hex');
  }

  async validateLicense(activationKey: string): Promise<boolean> {
    try {
      const hardwareId = await this.getHardwareId();
      const expectedKey = this.generateActivationKey(hardwareId);
      return expectedKey === activationKey;
    } catch (error) {
      return false;
    }
  }
}

export default LicenseManager.getInstance();
