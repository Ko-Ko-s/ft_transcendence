import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put, UploadedFile,
  UseInterceptors, UsePipes, ValidationPipe
} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
import { UsersService } from "./users.service";
import { InfoUserDto } from "./dto/info-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import {User} from "./users.model";
import {ChangeAuthDto} from "./dto/change-auth.dto";
import {ChangeNickDto} from "./dto/change-nick.dto";

function uuid4() {
  return "";
}

@Controller('users')
export class UsersController {

  constructor(private userService: UsersService) {}

  @Get('rating')
  getAllUsers() {
    return this.userService.getAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.userService.getOneById(id);
  }

  @Get('/:42api')
  auth42api(@Param('42api') api: string)  {
    return this.userService.getTokenFrom42(api);
  }

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto, @UploadedFile() avatar?) {
    return this.userService.createUser(createUserDto);
  }

  @Post('update/:id')
  @UseInterceptors(FileInterceptor('avatar'))
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  updateUser(@Body() infoUserDto: InfoUserDto, @Param('id') id: number) {
    return this.userService.updateUser(infoUserDto, id);
  }

  @Post('upload/:id')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Param('id') id: number): Promise<User> {
    return this.userService.updateAvatar(id, file);
  }


  @Put('changeauth/:id')
  changeAuthType(@Body() dto: ChangeAuthDto, @Param('id') id: number): Promise<User>  {
    return this.userService.changeAuthType(dto, id);
  }

  @Put('changenick/:id')
  changeNick(@Body() dto: ChangeNickDto, @Param('id') id: number): Promise<User>  {
    return this.userService.changeNick(dto, id);
  }

  @Delete(':id')
  removeUser(@Param('id') id: number) {
    return this.userService.removeUser(id);
  }


  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file', {
  //   storage: diskStorage({
  //     destination: './assets/avatars',
  //     filename: (req, file, cb) => {
  //       const fileName: string = uuid4();
  //       const extension: string = path.parse(file.originalname).ext;
  //       cb(null, `${fileName}${extension}`);
  //     }
  //   })
  // }))
  // uploadFile() {
  //
  // }

}
