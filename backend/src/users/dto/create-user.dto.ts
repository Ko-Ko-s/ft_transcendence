import {IsEmail, IsString, Length} from "class-validator";

export class CreateUserDto{

  // @IsString({message: 'Must be nick'})
  // @Length(3, 20, {message: 'min 3 max 20 symbols'})
  nick: string;

  // @IsString({message: 'Must be email'})
  // @IsEmail({},{message: 'Not e-mail'})
  email: string;

  // @IsString({message: 'Must be password'})
  // @Length(6, 20, {message: 'min 6 max 20 symbols'})
  readonly password?: string;

  // @IsString({message: 'Must be token'})
  token42?: string;

  // readonly avatar?: string;

}