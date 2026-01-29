const server = Bun.serve({
  fetch(req, server) {
    if (server.upgrade(req)) {
      return;
    }
    return new Response("Upgrade failed", { status: 500 });
  },
  websocket: {
    message(ws, message) {
      console.log({ ws, message });
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
