import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import {SequelizeModule} from "@nestjs/sequelize";
import { Chat } from './chat.model';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService],
  imports: [
    SequelizeModule.forFeature([Chat]),
    ChatsModule,
  ],
  exports: [ChatsService]
})
export class ChatsModule {}
