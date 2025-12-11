import  type{ HOtpDocument, Otp } from './otp.model';
import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
  Virtual,
} from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { USER_GENDER, USER_PROVIDER, USER_ROLE } from 'src/common/enum';
import { hashPassword } from 'src/common/utils/hash';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
})
export class User {
  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxLength: 20,
    trim: true,
  })
  fName: string;
  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxLength: 20,
    trim: true,
  })
  lName: string;
@Prop({ type: String, trim: true, minlength: 3, maxLength: 50 })
  userName: string;
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  email: string;
  @Prop({ type: String, required: true, trim: true })
  password: string;
  @Prop({ type: Number, required: true, min: 10, max: 100 })
  age: number;
  @Prop({ type: String, enum: USER_ROLE, default: USER_ROLE.USER })
  role: USER_ROLE;
  @Prop({ type: Boolean, default: false })
  confermed: boolean;
  @Prop({ type: String, enum: USER_GENDER, default: USER_GENDER.MALE })
  gender: USER_GENDER;
  @Prop({ type: String })
  address: string;
  @Prop({ type: String, required: true, min: 11, max: 11 })
  contact: string; ;
  @Prop({ type: String, enum: USER_PROVIDER, default: USER_PROVIDER.LOCAL })
  provider: USER_PROVIDER;
  @Prop({ type: Date, default: Date.now })
  changeCredentialsAT: Date;

  @Virtual()
  otp:HOtpDocument[]
}

export type HUserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.virtual('otp', {
  ref: 'Otp',
  localField: '_id',
  foreignField: 'createdBy',
})
export const UserModel = MongooseModule.forFeatureAsync([
  {
    name: User.name,
    useFactory: async () => {
    
      UserSchema.pre('save', async function (next) {
        if (this.isModified('password')) {
          this.password = await hashPassword(this.password);
        }
        next();
      });

 
      UserSchema.pre('save', function (next) {
        if (!this.userName) {
          this.userName = `${this.fName}${this.lName}`.replace(/\s+/g, ' ').toLowerCase();
        }
        next();
      });

      return UserSchema;
    },
  },
]);


