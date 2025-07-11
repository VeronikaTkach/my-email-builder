import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { EmailModule } from './src/email/email.module'

async function bootstrap() {
  const app = await NestFactory.create(EmailModule)
  app.enableCors({ origin: 'http://localhost:5173' })
  await app.listen(3000)
  console.log('📬 Email API listening on http://localhost:3000')
}
bootstrap()
