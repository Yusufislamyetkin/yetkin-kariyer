import { Resend } from "resend";

let resendInstance: Resend | null = null;

function getResend() {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  // Check if Resend is configured
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    const error = new Error("RESEND_API_KEY environment variable is not set");
    console.error("Email configuration error:", error);
    throw error;
  }

  const resend = getResend();
  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "YTK Academy <noreply@yetkinhub.com>";

  console.log(`Attempting to send password reset email to: ${email}`);
  console.log(`From email: ${fromEmail}`);
  console.log(`Base URL: ${baseUrl}`);

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Şifre Sıfırlama İsteği - YTK Academy",
      html: `
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
      `,
    });

    if (error) {
      console.error("Resend API error:", {
        message: error.message,
        name: error.name,
        error: JSON.stringify(error, null, 2),
      });
      throw new Error(`E-posta gönderilemedi: ${error.message || "Bilinmeyen hata"}`);
    }

    if (!data) {
      console.error("Resend returned no data and no error");
      throw new Error("E-posta gönderilemedi: Yanıt alınamadı");
    }

    console.log(`Password reset email sent successfully. Resend ID: ${data.id}`);
    return data;
  } catch (error: any) {
    console.error("Email send error details:", {
      message: error?.message,
      stack: error?.stack,
      email: email,
      fromEmail: fromEmail,
      baseUrl: baseUrl,
    });
    throw error;
  }
}

