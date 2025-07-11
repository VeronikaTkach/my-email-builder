// src/email/email.module.ts
import { Module } from '@nestjs/common'
import { MailerModule } from '@nestjs-modules/mailer'
import { EmailService } from './email.service'
import { EmailController } from './email.controller'

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: '19b9e51963857c',
          pass: '0863d2768c8d85',
        },
      },
      defaults: { from: '"Tester" <test@example.com>' },
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
