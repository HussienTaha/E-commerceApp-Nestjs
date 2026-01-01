import {  MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { OtpModel, OtpRepo, RevokedTokenModel,  RevokedTokenRepo,  UserModel, UserRepo } from "src/DB";
import { TokenService } from "src/common/service/token";
import { S3Service } from "src/common/service/s3.service";


   
@Module({
    imports: [UserModel ,OtpModel, RevokedTokenModel ],
    controllers: [UserController],
    providers: [UserService , UserRepo , OtpRepo,TokenService, S3Service,RevokedTokenRepo ],
})
export class userModule {
//  configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply( useTypeToken(),authantication)
//       .forRoutes({
//         path: "users/profile",
//         method:RequestMethod.ALL,
//       });
//   }
}