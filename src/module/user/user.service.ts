import { HttpException, Injectable } from "@nestjs/common";
import {  UserRepo } from "src/DB";



export class AppError extends HttpException {
    constructor(message: string, status?: number) {
        super(message, status!) ;
    }
}
// @InjectModel(User.name) private  userModel: Model<User>
@Injectable()
export class UserService {
    constructor( private readonly userRepo:UserRepo) {}
   async addUsers( Body: object) {
    const user = await this.userRepo.create(Body);
    return user



    }

     async getAllUsers() {
        const users = await this.userRepo.find({});
        return users
    }
}