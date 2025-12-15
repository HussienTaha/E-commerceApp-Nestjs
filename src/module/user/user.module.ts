import {  MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { OtpModel, OtpRepo, UserModel, UserRepo } from "src/DB";
import { TokenService } from "src/common/service/token";
import { authantication, useTypeToken } from "src/common/middleware";

   
@Module({
    imports: [UserModel ,OtpModel],
    controllers: [UserController],
    providers: [UserService , UserRepo , OtpRepo,TokenService],
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