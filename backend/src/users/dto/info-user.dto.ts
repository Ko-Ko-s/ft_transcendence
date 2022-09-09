import {IsEmail, IsString, Length} from "class-validator";

export class InfoUserDto {
  readonly id: number;

  @IsString({message: 'Nickname must be string'})
  @Length(3, 20, {message: 'min 3 max 20 symbols'})
  readonly nick: string;

  @IsString({message: 'Must be string'})
  @IsEmail({},{message: 'Not e-mail'})
  readonly email: string;

  @IsString({message: 'Must be string'})
  readonly password?: string;

  @IsString({message: 'Must be string'})
  readonly token42?: string;

  readonly avatar?: string;

  readonly onOffMode: string;
  readonly twoFactorAuth: boolean;
  readonly friends: number[];

  // readonly status: string;
  // readonly rating: number;
  // readonly friendsCount: number;
}