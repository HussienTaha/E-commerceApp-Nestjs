
import { JwtPayload, sign, SignOptions, verify } from "jsonwebtoken"

    


     export const generateToken = async ({ payload,signature,options}:{ 
      payload:object,
      signature:string,
      options?:SignOptions
     }):Promise<string> => {
         return sign(payload,signature,options)
     }



       const verifyToken = async ({token,signature}:{ 
        token:string,
        signature:string,

       }):Promise<JwtPayload> => {
           return  verify(token,signature)as JwtPayload
       }