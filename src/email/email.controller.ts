// src/email/email.controller.ts
import { Body, Controller, Post } from '@nestjs/common'
import { EmailService } from './email.service'

interface SendHtmlDto {
  to: string
  html: string
}

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async send(@Body() dto: SendHtmlDto) {
    await this.emailService.sendHtml(dto.to, dto.html)
    return { ok: true }
  }
}
