import nodemailer from 'nodemailer';
import env from '../../env.ts';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST || 'mailpit',
      port: parseInt(env.SMTP_PORT || '1025'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: env.SMTP_USER || '',
        pass: env.SMTP_PASS || ''
      }
    });
  }

  async sendTestEmail(to: string, subject: string, text: string, html?: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@devsyncc.ir',
        to,
        subject,
        text,
        html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendHealthCheckEmails(): Promise<{ success: boolean; results: Array<{ email: string; sent: boolean; error?: string }> }> {
    const testEmails = [
      'Yaldamahmoodi10@gmail.com',
      'mohammad.asghari1955@gmail.com',
      'amirnsamimi@gmail.com'
    ];

    const results = [];
    let allSuccessful = true;

    for (const email of testEmails) {
      try {
        const sent = await this.sendTestEmail(
          email,
          'CollegeGram Health Check - Email Test',
          'This is a test email from CollegeGram to verify that the email system is working correctly.',
          `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">CollegeGram Health Check</h2>
              <p>Hello!</p>
              <p>This is a test email to verify that our email system is working correctly.</p>
              <p><strong>Server:</strong> CollegeGram API</p>
              <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
              <p><strong>Status:</strong> ✅ Email system is operational</p>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 12px;">
                This email was sent automatically as part of our health check system.
              </p>
            </div>
          `
        );
        
        results.push({
          email,
          sent,
          error: sent ? undefined : 'Failed to send email'
        });

        if (!sent) {
          allSuccessful = false;
        }
      } catch (error) {
        results.push({
          email,
          sent: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        allSuccessful = false;
      }
    }

    return {
      success: allSuccessful,
      results
    };
  }
}

export default new EmailService();
