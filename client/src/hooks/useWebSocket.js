import { useRef, useState, useEffect } from "react";

const useWebSocket = () => {
  const SOCKET_URL = "ws://localhost:3001";
  const wsRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messageReceived, setMessageReceived] = useState(null);

  const openConnection = () => {
    if (wsRef.current) return;

    wsRef.current = new WebSocket(SOCKET_URL);

    wsRef.current.onopen = () => {
      setIsOpen(true);
      console.log("connected");
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      setMessageReceived(data);
    };

    wsRef.current.onclose = () => {
      setIsOpen(false);
      wsRef.current = null;
      console.log("disconnected");
    };
  };

  const closeConnection = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
  };

  const sendMessage = (message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.log("WebSocket is not open, cannot send message.");
    }
  };

  useEffect(() => {
    openConnection();

    return () => {
      closeConnection();
    };
  }, []);

  return {
    isOpen,
    messageReceived,
    sendMessage,
  };
};

export default useWebSocket;
