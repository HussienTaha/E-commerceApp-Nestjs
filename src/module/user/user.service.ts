import { HttpException, Injectable } from "@nestjs/common";



export class AppError extends HttpException {
    constructor(message: string, status?: number) {
        super(message, status!) ;
    }
}
@Injectable()
export class UserService {
    constructor() {}
    getUsers( Body: object) {
        return{body:Body};
        // throw new AppError("User not found",404);

    }
}