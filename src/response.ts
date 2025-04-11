import http, { IncomingMessage } from 'http';

class Response {

    private responce_data: string;

    public get data() : string {
        return this.responce_data;
    }

    public set_data(data: string) : void {
        this.responce_data = data;
    }

    constructor (url: string) {
        this.responce_data = "";
        this.get_responce(url);
    }

    public async get_responce(url: string) : Promise<string> {
        return new Promise((resolve, reject) => {
            http.get(url, (res: IncomingMessage) => {
                let data: string = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    try {
                        const parsedData: string = JSON.parse(data);
                        resolve(parsedData);
                    } catch (e) {
                        console.error('Error parsing JSON:', e);
                        reject(e);
                    }
                });
                }).on('error', (err) => {
                    console.error('Error making request:', err.message);
                });
        });
    }
}

export default Response;
