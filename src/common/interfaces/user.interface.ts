import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { HUserDocument } from "src/DB";
import { TokenType } from "../enum";

    


     export interface userRequst extends Request{
        user:HUserDocument;
        decoded:JwtPayload;
        TypeToken?:TokenType
     }