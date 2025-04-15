import express, {Application, Request, Response} from "express";
import {Server} from "http";
import path from "path";
import routes, { updateTcpData } from "./routes/index";
import {Server as WSServer} from "ws";

const app: Application = express();

let receivedTcpData: string = '';

export const getTcpData = (): string => {
    return receivedTcpData;
};

const closeServer = () => {
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
};

app.set('views', path.join(__dirname, '..', 'src', 'views'));
app.set('view engine', 'pug');

app.use(express.static('public'));
app.use('/', routes);

const server: Server = app.listen(3000, () => {
    console.log("Express server has started on port 3000");
  });


  console.log(server.address());

const wsServer: WSServer = new WSServer({server: server}, () => {
    console.log('WebSocket server has started on port 3000');
});

wsServer.on('connection', (ws: WebSocket) => {
    console.log('WebSocket connection established');


    ws.addEventListener('message', (event: MessageEvent) => {
        console.log('Received message:', event.data);
        if(event.data == '0'){
            closeServer();
        }
        ws.send('Answer back from sever:'+ event.data);
    });

    ws.addEventListener('close', () => {
        console.log('WebSocket connection closed');
        ws.close();
    });

    ws.addEventListener('error', (error: Event) => {
        console.log('WebSocket error:', error);
        ws.close();
    });

})
