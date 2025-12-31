
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { eventEmitter, OTP_ENUM } from 'src/common';
import { hashPassword } from 'src/common/utils/hash';

@Schema({ timestamps: true })
export class Otp {
  @Prop({ type: String, required: true, trim: true })
  code: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: String, required: true, enum: OTP_ENUM })
  type: OTP_ENUM;

  @Prop({ type: Date, required: true })
  expireAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
OtpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
OtpSchema.pre(
  'save',
  async function (
    this: HOtpDocument & { is_new: boolean; plainCode: string },
    next,
  ) { 
     console.log({this:this});
    if (this.isModified('code')) {
     this.plainCode = this.code;
      this.is_new = this.isNew;
      this.code = await hashPassword(this.code);
    await  this.populate([{ path: 'createdBy', select: 'email' }]);
    }
    next();
  },
);
// OtpSchema.post('save', async function (doc, next) {
//     const that = this as  HOtpDocument & { is_new: boolean; plainCode: string }
//     if (that.is_new){
//       eventEmitter.emit('confermemail', { email: (doc.createdBy as any).email, otp:that.plainCode });
//     }

// console.log({doc});
//   next();
// });

OtpSchema.post('save', async function (doc, next) {
  const that = this as HOtpDocument & {
    is_new: boolean;
    plainCode: string;
  };

  if (!that.is_new) return next();

  switch (doc.type) {
    case OTP_ENUM.CONFIRMEMAIL:
      eventEmitter.emit('confermemail', {
        email: (doc.createdBy as any).email,
        otp: that.plainCode,
      });
      break;

    case OTP_ENUM.FORGET_PASSWORD:
      eventEmitter.emit('forgetpassword', {
        email: (doc.createdBy as any).email,
        otp: that.plainCode,
      });
      break;
  }

  next();
});


export type HOtpDocument = HydratedDocument<Otp>;
export const OtpModel = MongooseModule.forFeature([
  { name: Otp.name, schema: OtpSchema },
]);
