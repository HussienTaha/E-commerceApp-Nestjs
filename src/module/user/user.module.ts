import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { OtpModel, OtpRepo, UserModel, UserRepo } from "src/DB";

@Module({
    imports: [UserModel ,OtpModel],
    controllers: [UserController],
    providers: [UserService , UserRepo , OtpRepo],
})
export class userModule {}