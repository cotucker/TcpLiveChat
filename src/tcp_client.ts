import {WebSocket} from "ws";
import * as readline from 'readline';
import chalk from "chalk";

const TUNNEL_URL: string = "ws://localhost:3000";
// const TUNNEL_URL: string = "wss://perceived-recorded-paraguay-list.trycloudflare.com";

let CLIENT_ID: string = "";
let RECIPIENT_ID: string = "";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

try {
    const socket: WebSocket = new WebSocket(TUNNEL_URL);

    socket.on("open", () => {
        console.log("Connected to server");
        rl.question('Enter your name: ', (answer: string) => {
            CLIENT_ID = answer;
            socket.send("/" + CLIENT_ID + " ");
            console.log("/" + CLIENT_ID + " ");

            sent_message();
        });
    })

    socket.on("message", (data: Buffer) => {
        console.log(chalk.bgBlue("\n" + data.toString()));
    })


    function sent_message(recipient_id?: string) {
        rl.question('Enter message: ', (answer: string) => {

            let parsed_answer: string[] = answer.split(" ");
            if(parsed_answer[0].includes("@")) {

                RECIPIENT_ID = parsed_answer[0].replace("@", '').length > 0 ? " /" + parsed_answer[0].replace("@", '') : "";
                answer = RECIPIENT_ID.length > 0? "User whats to sent u a message" : "User left your session";
            }


            let message: string = "/" + CLIENT_ID + RECIPIENT_ID + " " + answer;


            switch (answer) {
                case "/q":
                    rl.close();
                    socket.send(message);
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
                    socket.send(message);
                    socket.close();
                    console.log("Shutting down server...");
                    return;
                default:
                    socket.send(message);
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
