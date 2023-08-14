import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model, Schema, isValidObjectId } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userRepository: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async registration(createUserDto: CreateUserDto, res: Response) {
    try {
      //* < Check if password is fit with confirm one >

      const { password, confirm_password } = createUserDto;
      if (password !== confirm_password) {
        throw new BadRequestException(
          'Password is not fit with confirm_password ',
        );
      }

      //* < / Check if password is fit with confirm one >

      //* <Check with email if user is already registrated >

      let isUser = await this.userRepository.findOne({
        email: createUserDto.email,
      });
      if (isUser) throw new BadRequestException('User already registered');
      isUser = await this.userRepository.findOne({
        username: createUserDto.username,
      });
      if (isUser) throw new BadRequestException('Username is already on use');

      //* /<Check with email if user is already registrated >

      //* < Create new user  >
      const newUser = await this.userRepository.create({
        ...createUserDto,
        hashed_password: bcrypt.hashSync(password, 5),
      });
      if (!newUser)
        throw new InternalServerErrorException(
          'Error  while creating new user',
        );
      //* </ Create new user  >

      //* < Get tokens from "GetToken" method  >
      const tokens = await this.getTokens(newUser);
      //* </ Get tokens from "GetToken" method >

      //* < Update hashed token of user >
      newUser.hashed_token = bcrypt.hashSync(tokens.refresh_token, 5);
      //* </ Update hashed token of user >

      await newUser.save();

      res.cookie('refresh_token', tokens.refresh_token, {
        maxAge: 15 * 21 * 60 * 60 * 1000,
        httpOnly: true,
      });

      //*  < Returning >
      return {
        message: 'Successfully registered',
        user: newUser,
        accessToken: tokens.access_token,
      };
      //* </ Returning >
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async login(loginUserDto: LoginUserDto, res: Response) {
    try {
      const user = await this.userRepository.findOne({
        email: loginUserDto.email,
      });
      if (!user) {
        throw new UnauthorizedException('Email or password is incorrect ...');
      }
      if (!user.is_active) {
        throw new UnauthorizedException('User is not active');
      }
      const isTrue = await bcrypt.compare(
        loginUserDto.password,
        user.hashed_password,
      );
      if (!isTrue) {
        throw new UnauthorizedException('Email or password is incorrect ...');
      }

      const tokens = await this.getTokens(user);
      user.hashed_token = bcrypt.hashSync(tokens.refresh_token, 5);
      await user.save();

      res.cookie('refresh_token', tokens.refresh_token, {
        maxAge: 15 * 21 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return { accessToken: tokens.access_token, user: user };
    } catch (error) {}
  }

  async getAllUsers() {
    try {
      const users = await this.userRepository.find();
      if (!users.length) {
        throw new NotFoundException('There is no user yet');
      }
      return users;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOneUserById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Id must be a valid object ID');
    }
    const user = await this.userRepository.findOne({ _id: id });
    if (!user) {
      throw new NotFoundException('User with such a Id does not exist');
    }
    return user;
  }

  async updateUserById(id: string, updateUserDto: UpdateUserDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Not valid object ID');
    }
    const updatedUser = await this.userRepository.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException('No user found with id ');
    }
    return updatedUser;
  }

  async delteUserById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Not valid object ID');
    }
    const res = await this.userRepository.findByIdAndRemove(id);
    if (!res) {
      throw new NotFoundException('No user found with id ');
    }
    return { message: 'Deleted successfully', deletedUser: res.email };
  }

  //* < Get tokens helper >

  async getTokens(user: UserDocument) {
    const jwtPayload = {
      id: user._id,
      email: user.email,
      is_active: user.is_active,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
  //* </ Get tokens helper >
}
