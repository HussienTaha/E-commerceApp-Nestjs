import {  Module, } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { userModule } from './module/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { BrandModule } from './module/brand/brand.module';
import { CategoryModule } from './module/category/category.module';
import { subCategoryModule } from './module/subCategory/subCategory.module';





@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'config/.env',
      isGlobal: true,
    }),
    userModule,
    BrandModule,
    CategoryModule,
    subCategoryModule,
 
    MongooseModule.forRoot(process.env.MONGO_URL as string, {
      onConnectionCreate: (connection: Connection) => {
        connection.on('connected', () => console.log('connected to mongo db successfully 😎 😎'));

        connection.on('disconnected', () => console.log('disconnected from mongo db 😒 😒'));

        return connection;
      },
    }),
  
 
  ],
  controllers: [AppController],
  providers: [AppService, ],
})
export class AppModule {

     

}
