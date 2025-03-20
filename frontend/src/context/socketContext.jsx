import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};


export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    const urlAPI = import.meta.env.VITE_API_URL

    useEffect(() => {
        const newSocket = io.connect(urlAPI);
        setSocket(newSocket);
        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};