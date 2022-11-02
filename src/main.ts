import { NestFactory } from '@nestjs/core'
import * as bodyParser from 'body-parser'
import * as bodyParserXml from 'body-parser-xml'
import { AppModule } from './app.module'

const PORT = 3000

bodyParserXml(bodyParser)

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(bodyParser.xml({ xmlParseOptions: { explicitArray: false } }))
  await app.listen(PORT)
}
bootstrap().then(() => console.log(`Application is running on port: ${PORT} 🚀`))
