import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./users/users.model";
import { FilesService } from './files/files.service';
import { FilesModule } from './files/files.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import { FriendsService } from './friends/friends.service';
import { FriendsController } from './friends/friends.controller';
import { FriendsModule } from './friends/friends.module';
import { MatchesModule } from './matches/matches.module';
import * as path from 'path';
import {Match} from "./matches/matches.model";
import {UserMatches} from "./matches/user-matches.model";
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
// import { AppGateway } from './app.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath: '.env'}),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Match, UserMatches],
      autoLoadModels: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'assets/avatars/'),
    }),
    UsersModule,
    FilesModule,
    FriendsModule,
    MatchesModule,
    AuthModule,
    ChatsModule,
  ],
  controllers: [AppController, FriendsController],
  providers: [AppService, FilesService, FriendsService],
})
export class AppModule {}
