// src/email/email.service.ts
import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class EmailService {
  constructor(private readonly mailer: MailerService) {}

  async sendHtml(to: string, html: string) {
    await this.mailer.sendMail({
      to,
      subject: 'Ваше письмо',
      html,       // просто линкуем готовый HTML
    })
  }
}
