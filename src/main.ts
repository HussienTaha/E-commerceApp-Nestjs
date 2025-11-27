import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(
      ` ${process.env.APPNAME} started on port ${process.env.PORT || 5000} ❤️  😎`,
    );
  });
}
bootstrap().catch(console.error);
