import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { Chat } from './chat.model';
import {ChatsService} from "./chats.service";
import { CreateChatDto } from './dto/createChat.dto';

@Controller('chats')
export class ChatsController {
    constructor(private chatService: ChatsService) { }

    @Get('get/:id')
    findOne(@Param('id') id: number) : Promise<Chat>{
        return this.chatService.findOne(id);
    }

    @Get('filter/:chatType')
    findAllChatsByType(@Param('chatType') chatType: string) : Promise<Chat[]>{
        return this.chatService.findAllChatsByTypes(chatType);
    }

    @Post('add')
    createChat(@Body() createChatDto: CreateChatDto) : Promise<Chat>{
        return this.chatService.createChat(createChatDto);
    }

    @Get('getall')
    findAllChats() : Promise<Chat[]>{
        return this.chatService.findAllChats();
    }
}
