import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';

interface variablesData {
  token: string;
  link: string;
}

class SendMailService {
  private transport: Transporter;
  constructor() {
    //   const transporter = nodemailer.createTransport({
    //     host: 'smtp.gmail.com',
    //     port: 587,
    //     secure: false,
    //     auth: {
    //       user: process.env.MAIL_USER,
    //       pass: process.env.MAIL_PASSWORD,
    //     },
    //     tls: {
    //       rejectUnauthorized: false,
    //     },
    //   });
    //   this.transport = transporter;
    // }
    nodemailer.createTestAccount().then((account) => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.transport = transporter;
    });
  }

  async execute(
    to: string,
    subject: string,
    variables: variablesData,
    path: string
  ): Promise<any> {
    const templateFileContent = fs.readFileSync(path).toString('utf8');

    const mailTemplateParse = handlebars.compile(templateFileContent);

    const html = mailTemplateParse(variables);

    const message = await this.transport.sendMail({
      from: 'noreply <btcprojectionic@gmail.com>',
      to,
      subject,
      html,
    });

    return nodemailer.getTestMessageUrl(message);
  }
}

export default new SendMailService();
