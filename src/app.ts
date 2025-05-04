// import express, {Application, Request, Response} from "express";
import {Server} from "http";
import * as http from "http";
// import path from "path";
// import routes, { updateTcpData } from "./routes/index";
import chalk from "chalk";
// import { ChatRoom } from "./chat_room";
import {Server as WSServer, WebSocket as WebSocket} from "ws";

// const app: Application = express();

let receivedTcpData: string = '';
let chatRooms: WebSocket[] = [];

let chats: Map<string, WebSocket> = new Map<string, WebSocket>();

export const getTcpData = (): string => {
    return receivedTcpData;
};


export const getChats = (): Map<string, WebSocket> => {
    return chats;
};

const listClients = (): string => {
    let message: string = "";
    chats.forEach((value: WebSocket, key: string) => {
        message += key + "\n";
    });
    return message;
}


const closeServer = () => {
    wsServer.close(() => {
        console.log('WebSocket server closed');
    });
    server.close(() => {
        console.log('Server closed');
    });
};


const server: Server = http.createServer((req, res) => {
    console.log('Received request for %s', req.url);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello, World!\n');
});

server.listen(3000, () => {
    console.log('HTTP server has started on port 3000');
});

console.log(server.address());

const wsServer: WSServer = new WSServer({server: server}, () => {
    console.log('WebSocket server has started on port 3000');
});

wsServer.on('connection', (ws: WebSocket) => {

    console.log('WebSocket connection established');

    chatRooms.push(ws);

    ws.on('message', (data: Buffer) => {

        console.log('Unparsed message:', data.toString());
        let parsedData: string[] = data.toString().split(" ");
        let chatId_temp: string = parsedData[0];
        let chatId: string = chatId_temp.replace("/", '');
        let message: string = '', comment = '';
        let recipient_id: string = chatId;
        if (parsedData.length > 2 && parsedData[1].startsWith("/")) {
            comment = chalk.cyan(chalk.bgBlack("@" + chatId + ":")) + " ";
            recipient_id = parsedData[1].replace("/", "");
            message = parsedData.slice(2).join(" ");
        } else if (parsedData.length > 1) {
            comment = chalk.black("Echo from server: ");
            message = parsedData.slice(1).join(" ");
        }

        console.log('IDs :', chatId, " ", recipient_id);

        if(chatId_temp.includes("/")){
            if(message.length == 0){

                chats.set(chatId, ws);
                console.log(chalk.green("New client regesterd: ID =", chatId));
                ws.send(chalk.green("All clients:\n" + listClients()));
                return;
            } else {
                let recipient: WebSocket | undefined = chats.get(recipient_id);
                if(recipient == undefined){
                    ws.send(chalk.red("User not found"));
                    return;
                }
                switch(message){
                    case "/off":
                        console.log("Shutting down server...");
                        closeServer();
                        break;
                    case "/list":
                        recipient.send(chalk.green("All clients:\n" + listClients()));
                        break;
                    case "/q":
                        chats.delete(chatId);
                    default:
                        recipient.send(chalk.italic(comment) + chalk.black(message));
                        console.log(chalk.italic('Received message from user:', chatId, ":", message, "---", chatId.length));
                }
            }
        }
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
        ws.close();
    });

    ws.on('error', (error: Error) => {
        console.log('WebSocket error:', error);
        ws.close();
    });

})
