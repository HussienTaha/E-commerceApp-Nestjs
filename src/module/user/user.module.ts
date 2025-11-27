import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserModel, UserRepo } from "src/DB";

@Module({
    imports: [UserModel],
    controllers: [UserController],
    providers: [UserService , UserRepo],
})
export class userModule {}