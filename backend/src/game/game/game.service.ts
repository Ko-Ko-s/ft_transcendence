import { Injectable, Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WsResponse, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class GameService implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
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
    
    
    private position = {
        x: 280,
        y: 200
    };
    private positionBall = {
        x: 320,
        y: 240
    };
    private field = {
        width: 640,
        height: 480
    };
    private board = {
        width: 120,
        height: 10
    };
    private ball = {
        width: 20,
        height: 20
    };

    @SubscribeMessage('connection')
    async handleMessage(client: Socket, text: string) {
        // Socket.on("connection", socket => {
        client.broadcast.emit("position", this.position);
        client.broadcast.emit("positionBall", this.positionBall);
        client.broadcast.emit("move", data => {
            switch(data) {
                case "left":
                    if (this.position.x > 0)
                         this.position.x -=30;
                    client.broadcast.emit("position", this.position);
                    break ;
                case "right":
                    if (this.position.x < this.field.width - this.board.width)
                        this.position.x +=30;
                    client.broadcast.emit("position", this.position);
                    break ;
            }
        });

        //  socket.on("moveBall", data => {
        //      switch(data) {
        //          case "0":
        //              positionBall.x += 30;
        //              positionBall.y += 5;
        //              Socketio.emit("positionBall", positionBall);
     
        //                  // while(positionBall.x > 20) {
        //                  //     positionBall.x -= 30;
        //                  //     positionBall.y -= 5;
        //                  //     Socketio.emit("positionBall", positionBall);
        //                  // }
        //                  break;
        //          default:
        //              positionBall.x += 60;
        //              Socketio.emit("positionBall", positionBall);
        //              break;
        //      }
        //  });
    }
}
