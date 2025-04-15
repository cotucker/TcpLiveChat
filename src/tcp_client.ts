import {WebSocket} from "ws";
import * as readline from 'readline';

const TUNNEL_URL: string = "ws://localhost:3000";
// const TUNNEL_URL: string = "wss://gb-associations-atomic-constitutional.trycloudflare.com";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

try {
    const socket: WebSocket = new WebSocket(TUNNEL_URL);

    socket.on("open", () => {
        console.log("Connected to server");
    })

    socket.on("message", (data: Buffer) => {
        console.log("\n" + data.toString());
    })

    sent_message();

    function sent_message() {
        rl.question('Enter message: ', (answer: string) => {

            switch (answer) {
                case "/q":
                    rl.close();
                    socket.close();
                    return;
                case "/clear":
                    console.clear();
                    // clearData;
                    sent_message();
                    break;
                case "":
                    sent_message();
                    break;
                case "/off":
                    rl.close();
                    socket.send('0');
                    socket.close();
                    console.log("Shutting down server...");
                    return;

                default:
                    socket.send(answer);
                    sent_message();
                    break;
            }
            });
        }
    } catch (error) {
        console.error("Connection failed...");
        rl.close();
        process.exit(1);
    }
