import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'The email address of the user.',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The password of the user.',
    example: 'P@ssw0rd',
  })
  password: string;
}
