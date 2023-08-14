import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  HttpCode,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'; // Import swagger decorators
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';

@ApiTags('Users') // Add a tag to group related endpoints in Swagger
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'User Registration' }) // Add a description for the endpoint in Swagger
  @ApiBody({ type: CreateUserDto }) // Specify the input type for Swagger documentation
  @Post('registration')
  registration(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.registration(createUserDto, res);
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'User Login' })
  @ApiBody({ type: LoginUserDto })
  @Post('login')
  login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.login(loginUserDto, res);
  }

  @ApiOperation({ summary: 'Get All Users' })
  @Get('all')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @ApiOperation({ summary: 'Get User by ID' })
  @ApiResponse({
    status: 200,
    description: 'The found user',
    type: CreateUserDto,
  }) // Specify response type for Swagger
  @Get(':id')
  findOneUserById(@Param('id') id: string) {
    return this.userService.findOneUserById(id);
  }

  @ApiOperation({ summary: 'Update User by ID' })
  @ApiBody({ type: UpdateUserDto })
  @Put('update/:id')
  updateUserById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUserById(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete User by ID' })
  @Delete('delete/:id')
  delteUserById(@Param('id') id: string) {
    return this.userService.delteUserById(id);
  }
}
