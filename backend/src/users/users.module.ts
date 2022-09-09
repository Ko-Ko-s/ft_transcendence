import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./users.model";
import {FilesModule} from "../files/files.module";
import {Match} from "../matches/matches.model";
import {UserMatches} from "../matches/user-matches.model";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
      SequelizeModule.forFeature([User,  Match, UserMatches]),
      FilesModule
  ],
    exports: [UsersService]
})
export class UsersModule {}
