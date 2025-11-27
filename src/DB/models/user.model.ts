import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { USER_GENDER, USER_PROVIDER, USER_ROLE } from "src/common/enum";



@Schema( {timestamps : true ,toJSON : {virtuals : true }, toObject : {virtuals : true}, strictQuery : true } )
export class User {
@Prop( {type : String , required : true, minlength : 3, maxLength : 20, trim : true} )
   fName : string;
    @Prop( {type : String , required : true, minlength : 3, maxLength : 20, trim : true} )
   lName : string;
   @Virtual (
    {
        get : function(){
            return `${this.fName} ${this.lName}`
        },
        set : function(name){
            const [fName , lName] = name.split(' ');
            this.fName = fName;
            this.lName = lName;
        }
    }   
   )
   userName : string;
   @Prop( {type : String , required : true, unique : true, trim : true, lowercase : true} )
   email : string;
   @Prop( {type : String , required : true, trim : true} )
   password : string;
   @Prop( {type : String , required : true, trim : true} )
   confirmPassword : string;
   @Prop( {type : Number , required : true , min : 10 ,max : 100} )
   age : number;
   @Prop( {type : String ,enum : USER_ROLE  , default : USER_ROLE.USER} )
   role : USER_ROLE;
   @Prop( {type : Boolean , default : false} )
   confermed : boolean;
   @Prop( {type : String ,  enum : USER_GENDER  , default : USER_GENDER.MALE} )
   gender : USER_GENDER;
   address : string;
   contact : string;
   @Prop( {type : String ,  enum : USER_PROVIDER  , default : USER_PROVIDER.LOCAL} )
   provider : USER_PROVIDER;
   @Prop( {type : Date , default : Date.now} )
   changeCredentialsAT : Date;

}


 export const UserSchema = SchemaFactory.createForClass(User);
 export type HUserDocument = HydratedDocument<User>
  export const UserModel =  MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])