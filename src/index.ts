import index from "../public/index.html";

const server = Bun.serve({
  port: 3100,
  routes: {
    "/": index,
  },
  fetch(req, server) {
    if (server.upgrade(req)) {
      return;
    }
    return new Response("Upgrade failed", { status: 500 });
  },
  websocket: {
    message(ws, message: string) {
      ws.send(message.toUpperCase());
    },
    open(ws) {
      console.log("Client connected");
    },
    close(ws, code, message) {
      console.log("Client disconnected");
    },
    drain(ws) {},
  },
});

console.log(`Server running on port: ${server.url}`);
