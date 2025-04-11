import {Socket, Server} from "net";
import { updateTcpData } from "./routes";
const PORT = 2000;

const tcpServer: Server = new Server();

let s: string = '';

export const getData = (): string => {
    return s;
}

export const clearData = () => {
    s = '';
}


tcpServer.listen(PORT, "127.0.0.1", () => {
    console.log('Server listening on port ', PORT);
});

tcpServer.on('connection', (socket: Socket) => {
    console.log('Client connected');

    socket.on('data', (data: Buffer) => {

        let recived_data: string = data.toString();

        if (recived_data == "/clear") {
            s = '';
        }

        s += recived_data + "\n";

        console.log('Received data:', recived_data);
        socket.write("Answer back from sever: " + recived_data);

    });

    socket.on('end', () => {
        console.log('Client disconnected');
        socket.end();
        tcpServer.close();
    });
});
