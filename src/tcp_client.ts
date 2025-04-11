import {Socket} from "net";
import * as readline from 'readline';
import { clearData } from "./tcp_server";
// import { getProcess } from "./app";

// const HOST: string = "0.tcp.ngrok.io";
// const PORT: number = 17023;

const HOST: string = "127.0.0.1";
const PORT: number = 2000;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

const socket: Socket = new Socket();


socket.connect(PORT, HOST);


socket.on("data", (data: Buffer) => {
    console.log("\n" + data.toString());
})

socket.on("connect", () => {
    console.log("Connected to server");
})
sent_message();

function sent_message() {
    rl.question('Enter message: ', (answer) => {
        if(answer == "/q") {
           rl.close();
           socket.end();
           return;
        } else {
            if(answer == "/clear") {
                console.clear();
                // clearData;
                sent_message();
            }
            socket.write(answer);
            sent_message();
        }
    })
}
