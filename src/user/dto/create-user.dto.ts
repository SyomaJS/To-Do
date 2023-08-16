import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The first name of the user.',
    example: 'John',
  })
  first_name: string;

  @ApiProperty({
    description: 'The last name of the user.',
    example: 'Doe',
  })
  last_name: string;

  @ApiProperty({
    description: 'The username chosen by the user.',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'The email address of the user.',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The password chosen by the user.',
    example: 'P@ssw0rd',
  })
  password: string;

  @ApiProperty({
    description: 'Confirmatory password entered by the user.',
    example: 'P@ssw0rd',
  })
  confirm_password: string;
}
