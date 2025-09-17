const http = require("http");
const { WebSocketServer } = require("ws");

const url = require("url");
const { v4: uuidv4 } = require("uuid");

const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = process.env.PORT || 8000;

const connections = {}; // keep track of all connections (dictionary)
const users = {}; // keep track of all users (dictionary)

// Notes: different model and patters for sending and receiving messages
// 1. one to one (private chat)
// 2. one to many (group chat)
// 3. many to many (collaborative editing, multiplayer game)

const broadcast = () => {
  // send data to all connected clients as soon as there is an update in state in websocket server
  Object.keys(connections).forEach((uuid) => {
    const connection = connections[uuid];
    const message = JSON.stringify(users);
    connection.send(message);
  });
};

const handleMessage = (bytes, uuid) => {
  // when a client move cursor send messagee of cursor coordinates
  // message is the state payload from client
  const message = JSON.parse(bytes.toString());
  const user = users[uuid];

  user.state = message;
  // user.state.x = message.x;
  // user.state.y = message.y;

  broadcast();
  console.log(
    `${users[uuid].username} updated their state: ${JSON.stringify(user.state)}`
  );
};

const handleClose = (uuid) => {
  // when a client disconnects
  console.log(`${users[uuid].username} disconnected`);
  delete connections[uuid];
  delete users[uuid];

  broadcast();
};

wsServer.on("connection", (connection, request) => {
  // every time a client connects
  // ws://localhost:8000?username=John

  const { username } = url.parse(request.url, true).query;
  const uuid = uuidv4();
  console.log(`${username} ${uuid} connected`);

  // broadcast (fan out) to all other clients that a new user has joined
  connections[uuid] = connection; // store the connection dictionary
  users[uuid] = {
    username,
    state: {
      // x: 0,
      // y: 0,
      // presence info (if want to make websocket chat app)
      // isTyping: true/false
      // isOnline: true/false
      // onlineStatus: "away", "busy", "offline", "online"
    },
  };

  connection.on("message", (message) => handleMessage(message, uuid));
  connection.on("close", () => handleClose(uuid));
});

// Add graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`WebSocket server is listening on port ${port}`);
});
