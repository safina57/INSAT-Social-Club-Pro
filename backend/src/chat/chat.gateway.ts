import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload = this.jwtService.verify(token, {
        secret: this.config.get<string>('JWT_SECRET'),
      });

      client.data.user = payload;
      client.join(payload.id);
      console.log(`User ${payload.id} connected via socket`);
    } catch (err) {
      console.log('Socket authentication failed');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected`);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody()
    payload: { recipientId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const senderId = client.data.user.id;

    if (!senderId) {
      console.error('[Socket] Missing sender ID');
      client.emit('error', 'Sender not authenticated');
      return;
    }

    if (!payload.recipientId) {
      console.error('[Socket] Missing recipient ID');
      client.emit('error', 'Recipient ID required');
      return;
    }

    const message = await this.chatService.sendMessage(
      senderId,
      payload.recipientId,
      payload.content,
    );

    // Send to recipient’s room
    this.server.to(payload.recipientId).emit('new_message', message);
    return message;
  }

  private server: Server;

  afterInit(server: Server) {
    this.server = server;
  }
}
