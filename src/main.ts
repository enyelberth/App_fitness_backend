import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./common/filters/http-exception.filter";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix("api/v1");
  app.use(helmet());
  app.enableCors({
    origin: config.getOrThrow<string>("CORS_ORIGINS").split(","),
    credentials: true,
  });

  // Global filters
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  const swaggerConfig = new DocumentBuilder()
    .setTitle("FitQuest API")
    .setDescription("Fitness + RPG Game Backend")
    .setVersion("2.0")
    .addBearerAuth()
    .build();
  SwaggerModule.setup("docs", app, SwaggerModule.createDocument(app, swaggerConfig));

  await app.listen(config.get<number>("PORT", 4000));
}

void bootstrap();
