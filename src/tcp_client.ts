import {WebSocket} from "ws";
import * as readline from 'readline';
import chalk from "chalk";

let TUNNEL_URL: string = "ws://localhost:3000";

const helpMessage = chalk.yellow("Server commands:\n") +
                    chalk.cyan("  /list") + "       - Show list of connected users\n" +
                    chalk.cyan("  /q") + "          - Disconnect from server\n" +
                    chalk.cyan("  /off") + "        - Request server shutdown\n" +
                    chalk.cyan("  /help") + "       - Show this help message\n" +
                    chalk.cyan("  @username") + "   - Connect to user\n" +
                    chalk.cyan("  @") + "           - Disonnect from user\n" +
                    chalk.yellow("Client commands (see client's /help)");

// const TUNNEL_URL: string = "wss://perceived-recorded-paraguay-list.trycloudflare.com";

let CLIENT_ID: string = "";
let RECIPIENT_ID: string = "";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askQuestion = (question: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  };


(async () => {
    try {

        TUNNEL_URL = await askQuestion(chalk.yellow('Enter server addres: '));
        let socket: WebSocket;
        try {
            socket = new WebSocket(TUNNEL_URL);

        } catch (error) {
            console.error(chalk.red("Connection failed...") + chalk.blue("\nTrying to connect to localhost..."));
            TUNNEL_URL = "ws://localhost:3000";
        }

        socket = new WebSocket(TUNNEL_URL);
        socket.on("open", () => {
            console.log(chalk.yellow("Connected to server"));
            rl.question(chalk.yellow('Enter your name: '), (answer: string) => {
                CLIENT_ID = answer;
                socket.send("/" + CLIENT_ID + " ");
                // console.log("/" + CLIENT_ID + " ");
                console.log(helpMessage);
                sent_message();
            });
        })

        socket.on("message", (data: Buffer) => {
            console.log("\n" + data.toString());
        })
        socket.on('error', () => {
            console.log(chalk.red("Connection failed..."));
        })
        socket.on('close', () => {
            process.exit(0);
        })


        function sent_message() {
            rl.question(chalk.cyan(RECIPIENT_ID.replace(" /", '@') + ' ---> '), (answer: string) => {

                let parsed_answer: string[] = answer.split(" ");
                if(parsed_answer[0].includes("@")) {

                    RECIPIENT_ID = parsed_answer[0].replace("@", '').length > 0 ? " /" + parsed_answer[0].replace("@", '') : "";
                    answer = RECIPIENT_ID.length > 0? "User whats to sent u a message" : "U left the session";
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
                        sent_message();
                        break;
                    case "":
                        sent_message();
                        break;
                        case "/help":
                        console.log(helpMessage);
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

})();
