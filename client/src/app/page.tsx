"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormEvent, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

type MessageFormat = {
  id: string;
  message: string;
  createdAt: Date;
  port: number;
};

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "ws://127.0.0.1";

const CONNECTION_COUNT_UPDATED_CHANNEL = "chat:connection-count-updated";
const NEW_MESSAGE_CHANNEL = "chat:new-message";

function useSocket() {
  const [socket, setSocket] = useState<Socket | null>();
  useEffect(() => {
    const socketIo = io(SOCKET_URL, {
      reconnection: true,
      upgrade: true,
      transports: ["websocket", "polling"],
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return socket;
}

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageFormat[]>([]);
  const [connectionCount, setConnectionCount] = useState<number>(0);
  const socket = useSocket();

  useEffect(() => {
    socket?.on("connect", () => {
      console.log("connected test");
    });

    socket?.on(NEW_MESSAGE_CHANNEL, (message: MessageFormat) => {
      setMessages((prev) => [...prev, message]);
    });

    socket?.on(
      CONNECTION_COUNT_UPDATED_CHANNEL,
      ({ count }: { count: string }) => {
        setConnectionCount(parseInt(count));
      }
    );

    socket?.on("disconnect", () => {
      console.log("disconnected test");
    });
  }, [socket]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    socket?.emit(NEW_MESSAGE_CHANNEL, {
      message,
    });

    setMessage("");
  };
  return (
    <main className="min-h-screen flex bg-black/85">
      <div className="container mx-auto">
        <div className="h-20 flex flex-col gap-3">
          <h1 className="text-4xl font-bold text-white">Chat App</h1>
          <p className="text-white">Connected users: {connectionCount}</p>
        </div>
        {/* messages */}
        <ul className="flex py-2 flex-col space-y-2 h-[calc(100vh-240px)] flex-1 overflow-y-auto overflow-x-hidden">
          {messages.map((message) => (
            <li className="bg-white text-black p-2 rounded-lg">
              <p className="font-bold">PORT {message.port}</p>
              <p>{message.message}</p>
            </li>
          ))}
        </ul>
        <form
          onSubmit={handleSubmit}
          className="flex h-40 space-x-2 fixed left-0 right-0 bottom-0"
        >
          <Textarea
            placeholder="Type your message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={255}
            className="resize-none w-full"
          />
          <Button
            type="submit"
            disabled={message.length === 0}
            className="disabled:bg-black bg-white text-black h-full disabled:text-white font-bold"
          >
            Send
          </Button>
        </form>
      </div>
    </main>
  );
}
