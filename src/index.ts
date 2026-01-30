import index from "../public/index.html";

type WebSocketData = {
  channelId: string;
  xToken: string;
  session: Session;
};

type Session = {
  id: number;
  sessionId: string;
};

const server = Bun.serve({
  port: 3100,
  routes: {
    "/": index,
  },
  fetch(req, server) {
    const cookies = new Bun.CookieMap(req.headers.get("cookie")!);
    const channelId = new URL(req.url).searchParams.get("channelId") || "";

    const xToken = cookies.get("X-Token");
    const session = cookies.get("session");

    if (!xToken || !session) return;

    server.upgrade(req, {
      data: {
        channelId,
        xToken,
        session: JSON.parse(session),
      },
    });

    return undefined;

    // if (server.upgrade(req)) {
    //   return;
    // }
    // return new Response("Upgrade failed", { status: 500 });
  },
  websocket: {
    data: {} as WebSocketData,

    message(ws, message: string) {
      ws.publish("general-chat", message.toUpperCase());
      ws.send(message.toUpperCase());
    },
    open(ws) {
      console.log("Client connected");
      ws.subscribe("general-chat");
    },
    close(ws, code, message) {
      console.log("Client disconnected");
    },
    drain(ws) {},
  },
});

console.log(`Server running on port: ${server.url}`);
