import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

const PORT = 3000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: 'https://tally.cyanthing.com',
    credentials: true,
  })
  await app.listen(PORT)
}
bootstrap().then(() => console.log(`Application is running on port: ${PORT} 🚀`))
