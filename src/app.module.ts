import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { userModule } from './module/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'config/.env',
    }),
    userModule,
    MongooseModule.forRoot(process.env.MONGO_URL as string, {
      onConnectionCreate: (connection: Connection) => {
        connection.on('connected', () => console.log('connected to mongo db successfully 😎 😎'));

        connection.on('disconnected', () => console.log('disconnected from mongo db 😒 😒'));

        return connection;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
