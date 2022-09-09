import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WsResponse, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Chat } from './chat.model'
import { CreateChatDto } from './dto/createChat.dto';

@Injectable()
@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatsService implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  
  constructor(
    @InjectModel(Chat)
    private chatRepository: typeof Chat,
  ){}

  async findAllChats(): Promise<Chat[]> {
    return this.chatRepository.findAll();
  }

  async findAllChatsByTypes(chatType: string): Promise<Chat[]> {
    return this.chatRepository.findAll({
      where: {
        chatType: chatType
      }
    })
  }

  findOne (id: number): Promise<Chat> {
    return this.chatRepository.findOne({
      where: {
        id,
      },
    });
  }

  async remove (id: number): Promise<void> {
    const chat = await this.chatRepository.findOne({
      where: {id}}
    );
    await chat.destroy();
  }

  async createChat(createChatDto: CreateChatDto){
    const chat = await this.chatRepository.create(createChatDto);
    return chat;
  }

  @WebSocketServer() wss: Server;
  users: number = 0;

  private logger: Logger = new Logger('ChatService');
  
  afterInit(server: Server) {
      this.logger.log('Initialized!');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, text: string) {
    console.log('Broadcast Message: ' + text);
    // this.wss.emit('msgToClient', text);
    client.broadcast.emit('msgToClient', text);
  }


}
