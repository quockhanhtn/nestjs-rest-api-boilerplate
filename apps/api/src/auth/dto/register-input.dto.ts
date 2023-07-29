import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

import { IsAtLeastOneField } from '@libs/core/utils/class-validator';

export class RegisterInputDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false, example: 'email@address.com' })
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false, example: '+84987654321' })
  @IsString()
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsAtLeastOneField(['email', 'phoneNumber'], { message: 'Require email or phone number' })
  private _isValid: boolean;
}
