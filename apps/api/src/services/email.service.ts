import nodemailer from "nodemailer";
import env from "../../env.ts";

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: parseInt(env.SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: (env.SMTP_HOST === "localhost" || env.SMTP_HOST === "127.0.0.1" || env.SMTP_HOST === "mailpit") ? undefined : {
        user: env.SMTP_USER || "",
        pass: env.SMTP_PASS || "",
      },
    });
  }

  async sendTestEmail(
    to: string,
    subject: string,
    text: string,
    html?: string
  ): Promise<boolean> {
    try {
      const mailOptions = {
        from: env.EMAIL_FROM,
        to,
        subject,
        text,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.messageId);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  }

  async sendPasswordResetEmail(
    to: string,
    otp: string,
    username: string
  ): Promise<boolean> {
    try {
      const subject = "بازیابی رمز عبور - کالجگرام";
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl; text-align: right;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0;">کالجگرام</h1>
            <p style="color: #666; margin: 5px 0;">درخواست بازیابی رمز عبور</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">سلام ${username}!</h2>
            <p style="color: #555; line-height: 1.6;">
              ما درخواستی برای تغییر رمز عبور حساب کالجگرام شما دریافت کردیم. 
              لطفاً از کد تأیید زیر برای تکمیل فرایند بازیابی رمز عبور استفاده کنید.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #007bff; color: white; padding: 15px 30px; border-radius: 8px; display: inline-block;">
              <h1 style="margin: 0; font-size: 32px; letter-spacing: 5px; font-family: 'Courier New', monospace;">${otp}</h1>
            </div>
          </div>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; color: #856404;">
              <strong>مهم:</strong> این کد فقط به مدت ۵ دقیقه معتبر است. اگر شما این درخواست را ثبت نکرده‌اید، 
              لطفاً این ایمیل را نادیده بگیرید. رمز عبور شما بدون تغییر باقی خواهد ماند.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; font-size: 14px;">
              اگر در استفاده از دکمه بالا مشکل دارید، لینک زیر را کپی کرده و در مرورگر خود جای‌گذاری کنید.
            </p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            این ایمیل توسط کالجگرام ارسال شده است. در صورت داشتن هرگونه سؤال، لطفاً با تیم پشتیبانی ما تماس بگیرید.
          </p>
        </div>
      `;

      const text = `
        بازیابی رمز عبور - کالجگرام
        
        سلام ${username}!
        
        ما درخواستی برای تغییر رمز عبور حساب کالجگرام شما دریافت کردیم.
        لطفاً از کد تأیید زیر برای تکمیل فرایند بازیابی رمز عبور استفاده کنید:
        
        کد تأیید: ${otp}
        
        این کد فقط به مدت ۵ دقیقه معتبر است.
        
        اگر شما این درخواست را ثبت نکرده‌اید، لطفاً این پیام را نادیده بگیرید. رمز عبور شما بدون تغییر باقی خواهد ماند.
        
        با احترام،
        تیم کالجگرام
      `;

      return await this.sendTestEmail(to, subject, text, html);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      return false;
    }
  }

  async sendEmailVerificationEmail(
    to: string,
    otp: string,
    username: string,
    verificationLink: string,
    qrCode: string
  ): Promise<boolean> {
    try {
      const subject = "تأیید ایمیل - کالجگرام";
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl; text-align: right;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0;">کالجگرام</h1>
            <p style="color: #666; margin: 5px 0;">تأیید ایمیل</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">سلام ${username}!</h2>
            <p style="color: #555; line-height: 1.6;">
              خوش آمدید! برای تکمیل ثبت‌نام در کالجگرام، لطفاً ایمیل خود را تأیید کنید.
              می‌توانید از روش‌های زیر استفاده کنید:
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <h3 style="color: #333; margin-bottom: 20px;">روش اول: استفاده از کد تأیید</h3>
            <div style="background-color: #007bff; color: white; padding: 15px 30px; border-radius: 8px; display: inline-block;">
              <h1 style="margin: 0; font-size: 32px; letter-spacing: 5px; font-family: 'Courier New', monospace;">${otp}</h1>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <h3 style="color: #333; margin-bottom: 20px;">روش دوم: اسکن QR کد</h3>
            <div style="text-align: center;">
              <img src="${qrCode}" alt="QR Code" style="max-width: 200px; border: 1px solid #ddd; border-radius: 8px;">
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <h3 style="color: #333; margin-bottom: 20px;">روش سوم: کلیک روی لینک</h3>
            <a href="${verificationLink}" 
               style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              تأیید ایمیل
            </a>
          </div>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; color: #856404;">
              <strong>مهم:</strong> این کد و لینک فقط به مدت 5 دقیقه معتبر است. 
              اگر شما این درخواست را ثبت نکرده‌اید، لطفاً این ایمیل را نادیده بگیرید.
            </p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            این ایمیل توسط کالجگرام ارسال شده است. در صورت داشتن هرگونه سؤال، لطفاً با تیم پشتیبانی ما تماس بگیرید.
          </p>
        </div>
      `;
      
      const text = `
        تأیید ایمیل - کالجگرام
        
        سلام ${username}!
        
        خوش آمدید! برای تکمیل ثبت‌نام در کالجگرام، لطفاً ایمیل خود را تأیید کنید.
        
        کد تأیید: ${otp}
        
        لینک تأیید: ${verificationLink}
        
        این کد و لینک فقط به مدت ۳۰ دقیقه معتبر است.
        
        اگر شما این درخواست را ثبت نکرده‌اید، لطفاً این پیام را نادیده بگیرید.
        
        با احترام،
        تیم کالجگرام
      `;

      return await this.sendTestEmail(to, subject, text, html);
    } catch (error) {
      console.error("Error sending email verification email:", error);
      return false;
    }
  }

  async sendHealthCheckEmails(): Promise<{
    success: boolean;
    results: Array<{ email: string; sent: boolean; error?: string }>;
  }> {
    const testEmails = [
      "Yaldamahmoodi10@gmail.com",
      "mohammad.asghari1955@gmail.com",
      "amirnsamimi@gmail.com",
    ];

    const results = [];
    let allSuccessful = true;

    for (const email of testEmails) {
      try {
        const sent = await this.sendTestEmail(
          email,
          "CollegeGram Health Check - Email Test",
          "This is a test email from CollegeGram to verify that the email system is working correctly.",
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
          error: sent ? undefined : "Failed to send email",
        });

        if (!sent) {
          allSuccessful = false;
        }
      } catch (error) {
        results.push({
          email,
          sent: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        allSuccessful = false;
      }
    }

    return {
      success: allSuccessful,
      results,
    };
  }
}

export default new EmailService();
