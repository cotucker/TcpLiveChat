import Response from "./response";

const URL: string = "http://api.weatherapi.com/v1/current.json?key=e756ac9e718447a0ae9133510252303&q=London&aqi=no";

let response: Response = new Response(URL);

response.get_responce(URL).then((res) => {
    response.set_data(res);
    console.log(response.data);
});
