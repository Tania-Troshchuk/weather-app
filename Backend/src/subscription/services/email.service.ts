import { Injectable } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailService {
  private readonly transporter: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.transporter = nodemailer?.createTransport({
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      auth: {
        user: 'your_email@example.com',
        pass: 'your_password',
      },
    });
  }

  // const transporterMain = nodemailer.createTransport({
  //   host: 'sandbox.smtp.mailtrap.io',
  //   port: 2525,
  //   ssl: false,
  //   tls: true,
  //   auth: {
  //     user: main.user,
  //     pass: main.pass,
  //   },
  // });

  async sendMail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: 'Weather App',
        to,
        subject,
        html,
      });
    } catch (error) {
      console.log("Error during sending email: ", error)
    }
  }
}