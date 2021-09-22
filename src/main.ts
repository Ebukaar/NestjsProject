import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as winston from 'winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const logger = winston.createLogger({ //we are creating a logger
  level: 'info', // A log level of info
  format: winston.format.json(), //We want our log to be in Json format
  defaultMeta: {service: 'ugum-saas' },
  transports:[
    //
    // -Write all logs with level `error` and below to `error.log`
    // -Write all logs with level `info` and below to `combined.log`
    //

    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    //whenever the logger level is error display error.log but every other log display combined.log
    new winston.transports.File({filename: 'combined.log'}),
  ],
})

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  /** Setup Swagger for API documentation */
  const options = new DocumentBuilder()
    .setTitle("Internship Application")
    .setDescription("Application developed as teaching aid for Internship")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document); //the swagger URL is thus /api

  await app.listen(3000);
  logger.info(`Application is running on: ${await app.getUrl()}`)
}
bootstrap();
