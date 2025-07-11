import nodemailer from "nodemailer";

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  async sendResetPasswordEmail(to: string, resetLink: string) {
    const mailOptions = {
      from: `"FAQ Icomp" <${process.env.GMAIL_USER}>`,
      to,
      subject: "Redefinição de senha",
      html: `
        <p>Você solicitou a redefinição de senha.</p>
        <p>Clique no link abaixo para criar uma nova senha:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Se você não solicitou, ignore este e-mail.</p>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("✅ E-mail enviado:", info.messageId);
    } catch (error) {
      console.error("❌ Erro ao enviar e-mail:", error);
      throw error;
    }
  }
}

export default new EmailService();
