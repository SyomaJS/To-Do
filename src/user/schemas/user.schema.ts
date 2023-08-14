import { IsEmail, IsNotEmpty, IsBoolean, Min, Max } from 'class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
  @Prop({ required: true, trim: true })
  @IsNotEmpty({ message: 'FirstName should not be empty' })
  first_name: string;

  @Prop({ required: true, trim: true })
  @IsNotEmpty({ message: 'LastName should not be empty' })
  last_name: string;

  @Prop({ required: true, trim: true, unique: true })
  @IsNotEmpty({ message: 'UserName should not be empty' })
  username: string;

  @Prop({ required: true, trim: true, unique: true })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail()
  email: string;

  @Prop({ required: true, trim: true })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @Max(20)
  @Min(6)
  hashed_password: string;

  @Prop({ default: null, required: false })
  hashed_token: string;

  @Prop({ default: true })
  @IsBoolean({ message: 'Is active has to be boolean' })
  is_active: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
