
/* eslint-disable no-console */
/* global onmessage */

console.log("Worker process started.");
let socket;
const net = require("net");
const server = net.createServer();
server.listen("output.sock");
server.on("connection", function(s) {
  console.log("conn", s);
  socket = s;

  s.on("close", function() {
    socket = null;
  });
});

onmessage = function(e) {
  if (socket) {
    socket.write(Buffer.from(e.data));
  }
};
