const http = require("http");
const app = require("./app");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 3333;
const server = http.createServer(app);

console.log(`Starting server on Port: ${PORT}`);

server.listen(PORT);
