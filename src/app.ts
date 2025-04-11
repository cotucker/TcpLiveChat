import express, {Application, Request, Response} from "express";
import {Server, ClientRequest} from "http";
import path from "path";
import routes, { updateTcpData } from "./routes/index";
import {Socket, Server as TCPServer} from "net";

const TCP_SERVER_PORT = 2000;
const app: Application = express();
const tcpServer: TCPServer = new TCPServer();


let receivedTcpData: string = '';

export const getTcpData = (): string => {
    return receivedTcpData;
};




tcpServer.listen(TCP_SERVER_PORT, "127.0.0.1", () => {
    console.log('Server listening on port ', TCP_SERVER_PORT);
});

tcpServer.on('connection', (socket: Socket) => {
    console.log('Client connected');

    socket.on('data', (data: Buffer) => {
        let recived_data: string = data.toString();

        if (recived_data == "/clear") {
            receivedTcpData = '';
            console.clear();
        } else {
            receivedTcpData += recived_data + "\n";
        }

        console.log('Received data:', recived_data);
        socket.write("Answer back from sever: " + recived_data);

    });

    socket.on('end', () => {
        console.log('Client disconnected');
        socket.end();
        tcpServer.close();
    });
});


app.set('views', path.join(__dirname, '..', 'src', 'views'));
app.set('view engine', 'pug');

app.use(express.static('public'));
app.use('/', routes);

const server: Server = app.listen(3000, () => {
    console.log("Express server has started on port 3000");
  });

console.log(server.address());
