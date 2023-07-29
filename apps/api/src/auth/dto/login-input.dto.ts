import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginInputDto {
  @ApiProperty({
    examples: ['email@address.com', '+84969696029'],
    description: 'Email / phone number / user name',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  account: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
