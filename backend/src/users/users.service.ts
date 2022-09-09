import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InfoUserDto } from "./dto/info-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import {User} from "./users.model";
import {InjectModel} from "@nestjs/sequelize";
import {FilesService} from "../files/files.service";
import {ChangeAuthDto} from "./dto/change-auth.dto";
import {where} from "sequelize";
import {ChangeNickDto} from "./dto/change-nick.dto";
import {Match} from "../matches/matches.model";
import {UserMatches} from "../matches/user-matches.model";

const avatars: string[] = [
    '/dog.png',
    '/fox.png',
    '/lion.png',
    '/owl.png',
    '/panda.png',
    '/wolf.png'
  // http://localhost:5001/
]

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User,
              private fileService: FilesService) {  }

  async getAll(): Promise<User[]> {
    const users =  await this.userRepository.findAll({include: [{model: Match, attributes:['id', 'winnerId', 'playerOneId', 'playerTwoId']}]});
    return users;
  }

  async getOneById(id: number): Promise<User> {
    const user =  await this.userRepository.findOne({where: {id}, include: [{model: Match, attributes:['id', 'winnerId', 'playerOneId', 'playerTwoId']}]});
    return user;
  }

  async findByNick(nick: string): Promise<User> {
    const user =  await this.userRepository.findOne({where: {nick}, include: [{model: Match, attributes:['id', 'winnerId', 'playerOneId', 'playerTwoId']}]});
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user =  await this.userRepository.findOne({where: {email}, include: [{model: Match, attributes:['id', 'winnerId', 'playerOneId', 'playerTwoId']}]});
    return user;
  }

  async updateUser(infoUserDto: InfoUserDto, id: number): Promise<User> {
    // TODO check input data
    // console.log(JSON.stringify(infoUserDto));
    const user =  await this.userRepository.findOne({where: {id}});
    await user.update(infoUserDto);
    await user.save();
    return user;

    // let fileName: string;
    // if (!avatar) {
    //   // console.log("avatar empty!")
    //   const random = Math.floor(Math.random() * avatars.length);
    //   fileName = avatars[random];
    // } else {
    //   fileName = await this.fileService.uploadFile(avatar);
    // }
    // const user =  await this.userRepository.create({...createUserDto, avatar: fileName});
    // await user.update({friends: []});
    // return user;

  }

  async removeUser(id: number): Promise<void> {
    const user =  await this.userRepository.findOne({where: {id}});
    // TODO user not found
    await user.destroy();
  }

  async createUser(createUserDto: CreateUserDto) {
    let fileName: string = process.env.VUE_APP_ROOT_API;
    const random = Math.floor(Math.random() * avatars.length);
    fileName += avatars[random];
    let hashPass:  string;
    if (createUserDto.password) {
      hashPass = await bcrypt.hash(createUserDto.password, 5);
    }
    // const user = await this.userService.createUser({...userDto, password: hashPass});
    console.log(hashPass)
    const user =  await this.userRepository.create(createUserDto);
    await user.update({password: hashPass});
    await user.update({avatar: fileName});
    await user.update({friends: []});
    // await user.$set('avatar', fileName);
    return user;
  }

  async updateAvatar(id: number, file: Express.Multer.File): Promise<User> {
    const user =  await this.userRepository.findOne({where: {id}});
    // TODO if user not found
    let fileName: string;
    fileName = await this.fileService.uploadFile(file);
    await user.update({avatar: fileName}, {where: {id:id}});
    return user
  }

  async changeAuthType(dto: ChangeAuthDto, id: number): Promise<User>  {
    const user =  await this.userRepository.findOne({where: {id}});
    // TODO if user not found
    await user.update({twoFactorAuth: dto.authType}, {where: {id:id}})
    return user;
  }

  async changeNick(dto: ChangeNickDto, id: number): Promise<User>  {
    if(await this.findByNick(dto.newNick)){
      throw new HttpException('This nickname already exists, try another one', HttpStatus.BAD_REQUEST)
    }
    const user =  await this.userRepository.findOne({where: {id}});
    // TODO if user not found
    await user.update({nick: dto.newNick}, {where: {id:id}})
    return user;
  }

  getTokenFrom42(api: string) {
    return console.log(api);

  }
}
