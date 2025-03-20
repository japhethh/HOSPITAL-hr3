import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";



function Overview() {
  const [output, setOutput] = useState("");
  const [command, setCommand] = useState("");
  const [serverStatus, setServerStatus] = useState("Fetching...");
  const [isLoading, setIsLoading] = useState(true);

  const socket = useSocket();

  useEffect(() => {
    socket.emit("check_if_allowed");

    socket.on("terminal-output", (data) => {
      setOutput((prev) => prev + data);
    });

    socket.on("server-status", (data) => {
      setServerStatus(data);
    });

    const handleAccessStatus = (response) => {
      if (response.status) {
        console.log(response.status);
        socket.emit("fetch-server-status");
        socket.emit("command", "pm2 logs");
        setIsLoading(false);
        setNoAccess(false);
      } else {
        setIsLoading(false);
      }
    };

    socket.on("access_status", handleAccessStatus);

    return () => {
      socket.off("terminal-output");
      socket.off("server-status");
      socket.off("access_status");
    };
  }, []);

  const fetchServerStatus = () => {
    setServerStatus("Fetching...");
    socket.emit("fetch-server-status");
  };

  if (isLoading) {
    return <div className="flex w-full h-screen items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-auto w-full bg-gray-200 text-green-500 p-4 overflow-hidden">
      <div className="mb-4">
        <h2 className="text-black font-bold">Server Status:</h2>
        <pre className="bg-gray-800 p-2 rounded text-white overflow-x-auto">{serverStatus}</pre>
        <button onClick={fetchServerStatus} className="bg-yellow-500 px-4 py-2 mt-2 rounded hover:bg-yellow-600 transition text-black">Refresh Status</button>
      </div>

      <div className="flex flex-col flex-1 mb-4">
        <h2 className="text-black font-bold">Terminal Output:</h2>
        <pre className="overflow-auto h-80 md:h-[30vh] lg:h-[80vh] bg-gray-800 p-2 rounded text-white border border-gray-700">{output}</pre>
      </div>

    </div>
  );
}

export default Overview;
