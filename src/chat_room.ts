import {WebSocket} from "ws";


export class ChatRoom {
    private web_sockets: WebSocket[] = [];

    constructor(creatorWebSocket: WebSocket) {
        this.web_sockets.push(creatorWebSocket);
    }
}
