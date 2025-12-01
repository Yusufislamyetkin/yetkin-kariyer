import nodemailer from "nodemailer";

// Create reusable transporter instance
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (!smtpUser || !smtpPassword) {
      throw new Error(
        "SMTP_USER and SMTP_PASSWORD environment variables must be set"
      );
    }

    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });
  }

  return transporter;
}

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
) {
  // Check if SMTP is configured
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;

  if (!smtpUser || !smtpPassword) {
    // Enhanced error logging for debugging
    console.error("Email configuration error - Environment variables check:", {
      SMTP_USER: smtpUser ? `${smtpUser.substring(0, 3)}***` : "NOT SET",
      SMTP_PASSWORD: smtpPassword ? "***SET***" : "NOT SET",
      SMTP_HOST: process.env.SMTP_HOST || "NOT SET (using default: smtp.gmail.com)",
      SMTP_PORT: process.env.SMTP_PORT || "NOT SET (using default: 587)",
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL ? "true" : "false",
      allEnvKeys: Object.keys(process.env).filter(key => key.includes("SMTP")).join(", "),
    });
    
    const error = new Error(
      "SMTP_USER and SMTP_PASSWORD environment variables are not set. " +
      "Please check: 1) Variables are set in Vercel dashboard (Settings > Environment Variables), " +
      "2) Deployment was restarted after adding variables, " +
      "3) Variables are set for the correct environment (Production/Preview/Development)"
    );
    console.error("Email configuration error:", error);
    throw error;
  }

  const transporter = getTransporter();
  const baseUrl =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
  const fromEmail =
    process.env.SMTP_FROM_EMAIL ||
    `YTK Academy <${smtpUser}>`;

  console.log(`Attempting to send password reset email to: ${email}`);
  console.log(`From email: ${fromEmail}`);
  console.log(`Base URL: ${baseUrl}`);

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Şifre Sıfırlama</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px 12px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                    YTK Academy
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 24px; font-weight: 600;">
                    Şifre Sıfırlama İsteği
                  </h2>
                  
                  <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    Merhaba,
                  </p>
                  
                  <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    Hesabınız için şifre sıfırlama talebinde bulundunuz. Aşağıdaki butona tıklayarak yeni şifrenizi belirleyebilirsiniz.
                  </p>
                  
                  <!-- CTA Button -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                    <tr>
                      <td align="center" style="padding: 0;">
                        <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                          Şifremi Sıfırla
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Alternative Link -->
                  <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                    Eğer buton çalışmıyorsa, aşağıdaki linki tarayıcınıza kopyalayıp yapıştırabilirsiniz:
                  </p>
                  <p style="margin: 10px 0 20px; color: #667eea; font-size: 14px; word-break: break-all;">
                    <a href="${resetUrl}" style="color: #667eea; text-decoration: underline;">${resetUrl}</a>
                  </p>
                  
                  <!-- Security Warning -->
                  <div style="margin: 30px 0; padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                    <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                      <strong>Güvenlik Uyarısı:</strong> Bu link 1 saat süreyle geçerlidir. Eğer bu isteği siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz. Şifreniz değişmeyecektir.
                    </p>
                  </div>
                  
                  <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                    Sorularınız için bizimle iletişime geçebilirsiniz.
                  </p>
                  
                  <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                    Saygılarımızla,<br>
                    <strong>YTK Academy Ekibi</strong>
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 20px 40px; text-align: center; background-color: #f9fafb; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; color: #6b7280; font-size: 12px; line-height: 1.6;">
                    Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: "Şifre Sıfırlama İsteği - YTK Academy",
      html: htmlContent,
    });

    console.log(`Password reset email sent successfully. Message ID: ${info.messageId}`);
    return info;
  } catch (error: any) {
    console.error("Email send error details:", {
      message: error?.message,
      stack: error?.stack,
      email: email,
      fromEmail: fromEmail,
      baseUrl: baseUrl,
      code: error?.code,
      command: error?.command,
    });

    // Provide more specific error messages
    if (error?.code === "EAUTH") {
      throw new Error(
        "E-posta gönderilemedi: Gmail kimlik doğrulama hatası. Lütfen SMTP_USER ve SMTP_PASSWORD (App Password) değerlerini kontrol edin."
      );
    }

    if (error?.code === "ECONNECTION" || error?.code === "ETIMEDOUT") {
      throw new Error(
        "E-posta gönderilemedi: SMTP sunucusuna bağlanılamadı. Lütfen SMTP_HOST ve SMTP_PORT değerlerini kontrol edin."
      );
    }

    throw new Error(
      `E-posta gönderilemedi: ${error?.message || "Bilinmeyen hata"}`
    );
  }
}
