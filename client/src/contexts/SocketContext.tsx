import { Socket, io } from "socket.io-client";
import { FC, useState, createContext, useEffect, useCallback } from 'react';
import { userApi } from "src/store/features/UserApi";
import { useAppSelector } from "src/hooks/redux";


type SocketContextType = {
    socket: Socket;
  };

const socket = io('http://localhost:3000', {
     autoConnect: false, 
     extraHeaders:{
        Authorization: `Bearer ${localStorage.getItem("token")}`
     }
    }
);

export const SocketContext = createContext({} as SocketContextType);
  
  export const SocketProvider: FC = ({ children }) => {
  
    const user = useAppSelector(state=>state.userReducer.user);


    useEffect(() => {
        console.log('user',user);
        
        if(!user) return;
        socket.connect(); // connect to socket
    
        socket.on("connect", () => { // fire when we have connection
          console.log("Socket connected");
        });
    
        socket.on("disconnect", () => { // fire when socked is disconnected
          console.log("Socket disconnected");
        });
    
       
    
        // remove all event listeners
        return () => {
          socket.off("connect");
          socket.off("disconnect");
        };
      }, [socket,user]);
    

    return (
      <SocketContext.Provider
        value={{ socket }}
      >
        {children}
      </SocketContext.Provider>
    );
  };
  