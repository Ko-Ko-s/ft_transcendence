import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import {UsersModule} from "../users/users.module";
import {SequelizeModule} from "@nestjs/sequelize";
import {Match} from "./matches.model";
import {User} from "../users/users.model";
import {UserMatches} from "./user-matches.model";

@Module({
  providers: [MatchesService],
  controllers: [MatchesController],
  imports: [
    SequelizeModule.forFeature([Match, User, UserMatches]),
    UsersModule,
  ],
  exports: [MatchesModule]
})
export class MatchesModule {}
