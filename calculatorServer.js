const http = require("http");
const fs = require("fs");
const qs = require("querystring");

const port = 3000;
const ip = "127.0.0.1";
var curItems = {};

const sendResponse = (filename, statusCode, response) => {
    fs.readFile(`./html/${filename}`, (error, data) => {
        if (error) {
            response.statusCode = 500;
            response.setHeader("Content-Type", "text/plain");
            response.end("Sorry, internal error.");
        } else {
            response.statusCode = statusCode;
            response.setHeader("Content-Type", "text/html");
            response.end(data);
        }
    });
};

const server = http.createServer((request, response) => {
    const method = request.method;
    let url = request.url;

    if (method === "GET") {
        const requestUrl = new URL(url, `http://${ip}:${port}`);
        url = requestUrl.pathname;

        if(url === "/") {
            sendResponse(`./calculator.html`, 200, response);
        } else {
            sendResponse(`./404.html`, 404, response);
        }
    } else {
        if (url === "/process-cart") {
            let body =[];

            request.on("data", (chunk) => {
                body.push(chunk);
            });

            request.on("end", () => {
                body = Buffer.concat(body).toString();
                body = qs.parse(body);
                if ('ItemName' in body) {
                    curItems[body['ItemName']] = body['Price'];
                }
                console.log(curItems);
                console.log(body);
            });
        }
    }
});

server.listen(port, ip, () => {
    console.log(`Server is runnig at http://${ip}:${port}`);
});
