import { RevokedTokenRepo } from './../../DB/repository/RevokedToken.repo';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  HRevokedTokenDocument,
  HUserDocument,
  OtpRepo,
  UserRepo,
} from 'src/DB';
import {
  confermEmailDto,
  forgetPasswordDto,
  loginDto,
  resedOtpDto,
  resetPasswordDto,
  signupDto,
  updateUser,
} from './DTO/user.dto';
import { OTP_ENUM, USER_GENDER } from 'src/common/enum';
import { generateOtp } from 'src/common/service';
import { v4 as uuidv4 } from 'uuid';
import { Types } from 'mongoose';
import { compare } from 'bcrypt';
import { generateToken } from 'src/common/service/token';
import {
  getRoleAccessSignature,
  getRoleRefreshSignature,
} from 'src/common/service/signature';
import { comparePassword, hashPassword } from 'src/common/utils/hash';
import { AppError } from 'src/common/service/errorhanseling';
import { S3Service } from 'src/common/service/s3.service';

// @InjectModel(User.name) private  userModel: Model<User>
@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly otpRepo: OtpRepo,
    private readonly s3Service: S3Service,
    private readonly revokedTokenRepo: RevokedTokenRepo,
  ) {}

  private async sendOtp(
    userId: Types.ObjectId,
    type: OTP_ENUM = OTP_ENUM.CONFIRMEMAIL,
  ) {
    const otp = await generateOtp();
    console.log(otp);
    await this.otpRepo.create({
      code: otp.toString(),
      createdBy: userId,
      type,
      expireAt: new Date(Date.now() + 5 * 60 * 1000),
    });
  }

  async signup(Body: signupDto) {
    const {
      fName,
      lName,
      email,
      age,
      password,
      contact,
      address,
      userName,
      gender,
    } = Body;

    const userExist = await this.userRepo.findOne({ email });
    if (userExist)
      throw new AppError('User already exists or not confermed', 409);

    const user = await this.userRepo.create({
      fName,
      lName,
      email,
      age,
      password,
      address,
      contact,
      userName,
      gender: gender ? (gender as USER_GENDER) : USER_GENDER.MALE,
    });
    await this.sendOtp(user._id);
    return { message: 'User created successfully 👌😊' };
  }

  async resedOtp(Body: resedOtpDto) {
    const { email } = Body;
    const userExist = await this.userRepo.findOne({ email, confermed: true });
    if (userExist)
      throw new AppError('User already exists and confermed 😎😎', 409);

    const user = await this.userRepo.findOne(
      { email, confermed: false },
      undefined,
      { populate: [{ path: 'otp', select: 'code' }] },
    );

    if (user?.otp?.length! > 0) {
      throw new AppError('Otp already sent ', 409);
    }
    if (!user) throw new AppError('User not found', 404);
    await this.sendOtp(user._id);
    return { message: 'Otp sent successfully 👌😊' };
  }

  async confermEmail(Body: confermEmailDto) {
    const { otp, email } = Body;
    const user = await this.userRepo.findOne(
      { email, confermed: false },
      undefined,
      { populate: { path: 'otp' } },
    );

    console.log(user);
    if (!user) throw new AppError('User not found', 404);
    if (await !compare(otp, user.otp[0].code))
      throw new AppError('Invalid Otp', 400);
    await this.userRepo.updateOne(
      { _id: user._id },
      { $set: { confermed: true } },
    );
    await this.otpRepo.deleteOne({ createdBy: user._id });

    return { message: 'Email confermed successfully 👌😊' };
  }

  async login(Body: loginDto) {
    const { email, password } = Body;
    const user = await this.userRepo.findOne({ email, confermed: true });
    if (!user) throw new AppError('User not found', 404);

    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) throw new AppError('Invalid Password', 400);

    const accessSignature = getRoleAccessSignature(user?.role);
    const refreshSignature = getRoleRefreshSignature(user?.role);
    console.log(accessSignature, refreshSignature);
    const jwtid = uuidv4();
    const accessToken = await generateToken({
      payload: { userId: user._id, role: user.role, email: user.email },
      signature: accessSignature,
      options: { expiresIn: '1y', jwtid },
    });
    const refreshToken = await generateToken({
      payload: { userId: user._id, role: user.role, email: user.email },
      signature: refreshSignature,
      options: { expiresIn: '1y', jwtid },
    });

    return { message: 'Login successfully ❤️❤️', accessToken, refreshToken };
  }

  async uploadFile(file: Express.Multer.File, user: HUserDocument) {
    const userExists = await this.userRepo.findOne({ _id: user._id });
    if (!userExists) throw new AppError('User not found', 404);

   const url = await this.s3Service.uploadFile({
      file,

      Path: `users/${user._id}/${file.originalname}`,
    });
 const userimage = await this.userRepo.updateOne(
      { _id: user._id },
      { $set: { image: url } },
    );
    await user.save();
    return { message: 'file uploded sucssesfuly', userExists };
    
  }

  // forget password
  async forgetPassword(Body: forgetPasswordDto) {
    const { email } = Body;
    const user = await this.userRepo.findOne({ email, confermed: true });
    if (!user) throw new AppError('User not found', 404);
    await this.sendOtp(user._id, OTP_ENUM.FORGET_PASSWORD);
    return { message: 'Otp sent successfully 👌😊' };
  }

  // reset password
  async resetPassword(Body: resetPasswordDto) {
    const { otp, email, password } = Body;
    const user = await this.userRepo.findOne(
      { email, confermed: true },
      undefined,
      { populate: { path: 'otp' } },
    );

    const otpDoc = await this.otpRepo.findOne({
      createdBy: user?._id,
      type: OTP_ENUM.FORGET_PASSWORD,
    });
    if (!otpDoc) throw new AppError('Otp not found or not valid', 404);

    if (!user) throw new AppError('User not found', 404);
    if (await !compare(otp, user.otp[0].code))
      throw new AppError('Invalid Otp', 400);
    const hashedPassword = await hashPassword(password);
    await this.userRepo.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } },
    );
    await user.save();
    await this.otpRepo.deleteOne({ createdBy: user._id });
    return { message: 'Password reset successfully 👌😊' };
  }

  // logout

  async logout(user: any, userr: HUserDocument) {
    await this.revokedTokenRepo.create({
      tokenId: user.jti,
      userId: user.userId,
      expiredAt: new Date(user.exp * 1000 * 1000),
    });

    await this.revokedTokenRepo.deleteMany({ expiredAt: { $lte: new Date() } });
     await userr.updateOne({ changecredentials: new Date() });

    return { message: 'Logout successfully 👌😊' };
  }



  // update user
    async updateUser(id:  Types.ObjectId, Body: updateUser, user: HUserDocument) {

     const foundUser = await this.userRepo.findOne({ _id: id });
      if (!foundUser) throw new AppError('User not found', 404);


      const { lName, email, fName, contact, address ,age   } = Body;


      const userExist = await this.userRepo.findOne({ email });
      if (userExist) throw new AppError('User already exists', 409);
   const updatedUser =   await this.userRepo.updateOne(
        { _id: user._id },
        {
          $set: {
            fName,
            lName,
            email,
            contact,
            address,
            age,
          },
        },
      );
      await user.save();
   
      return { message: 'User updated successfully 👌😊', updatedUser};
    }


  async uploadFileimage(id: Types.ObjectId, file: Express.Multer.File, user: HUserDocument) {
    const userExists = await this.userRepo.findOne({ _id: id });
    if (!userExists) throw new AppError('User not found', 404);
 const url = await this.s3Service.uploadFile({
      file,
      Path: `users/${user._id}/${file.originalname}`,
    });

   const uploded =  await this.userRepo.updateOne(
      { _id: user._id },
      { $set: { image: url } },
    );
    await user.save();
    // return { message: 'file uploded sucssesfuly', url };

    if (!uploded) {
      await this.s3Service.deleteFile({ Key: url });
      throw new InternalServerErrorException('Failed to update user image');
    }


    await this.s3Service.deleteFile({ Key: userExists.image });
    return { message: 'file uploded sucssesfuly', url };

  }



  async freezeUser( user: HUserDocument) {
    const userExists = await this.userRepo.findOne({ _id: user._id });
    if (!userExists) throw new AppError('User not found', 404);
    const updatedUser = await this.userRepo.updateOne(
      { _id: user._id },
      { $set: { deletedAt: new Date() } },
    );
    await user.save();
    return { message: 'User updated successfully 👌😊', updatedUser };
  }


  async unFreezeUser( user: HUserDocument) {
    const userExists = await this.userRepo.findOne({ _id: user._id });
    if (!userExists) throw new AppError('User not found', 404);
    const updatedUser = await this.userRepo.updateOne(
      { _id: user._id },
      { $set: { deletedAt: null } },
    );
    await user.save();
    return { message: 'User updated successfully 👌😊', updatedUser };
  }




    async refreshToken( user: HUserDocument) {
    
   
    const accessSignature = getRoleAccessSignature(user?.role);
    const refreshSignature = getRoleRefreshSignature(user?.role);
    console.log(accessSignature, refreshSignature);
    const jwtid = uuidv4();
    const accessToken = await generateToken({
      payload: { userId: user._id, role: user.role, email: user.email },
      signature: accessSignature,
      options: { expiresIn: '1y', jwtid },
    });
    const refreshToken = await generateToken({
      payload: { userId: user._id, role: user.role, email: user.email },
      signature: refreshSignature,
      options: { expiresIn: '1y', jwtid },
    });

    return { message: 'Login successfully ❤️❤️', accessToken, refreshToken };
  }

}
