import { Server, Socket } from "socket.io";

interface OnlineUser {
  userId: string;
  name: string;
  socketId: string;
}
let onlineUsers: OnlineUser[] = []

const SocketServer = async(socket: Socket, io: Server) => {
    socket.emit("me", socket.id);
    socket.on("join", (user) => {
        console.log(user);
        
        if (!user || !user.id) return;
        // console.log(user);
        socket.join(user.id);
        const existingUserIndex = onlineUsers.findIndex(u => u.userId === user.id);
        if(existingUserIndex !== -1) {
            onlineUsers[existingUserIndex].socketId = socket.id;
        } else { 
            onlineUsers.push({
                userId: user.id,
                name: user.name,
                socketId: socket.id,
              });
        }

        io.emit("update-online-users", onlineUsers)
        console.log("Online Users after join:", onlineUsers);
    })

    socket.on("get-online-users", () => {
        socket.emit("update-online-users", onlineUsers);
    });
    
    socket.on("callToUser", (data) => {
        console.log("Backend call to user", data.from, data.name);
        let userSocktData = onlineUsers.find(user => user.userId === data.callToUserId)
        if(userSocktData) {
            console.log("call to user id", userSocktData);
            io.to(userSocktData.socketId).emit("callToUser", {
                signal: data.signalData,
                from: data.from,
                name: data.name
            })
        }
    })

    socket.on("reject-call", (data) => {
        io.to(data.to).emit("callRejected", {
            name: data.name
        })
    })

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", {
            signal: data.signal,
            from: data.from
        })
    })

    socket.on("toggle-video", (data) => {
        io.to(data.to).emit("toggle-video", { from: data.from, isEnabled: data.isEnabled });
    });
    
    socket.on("toggle-audio", (data) => {
        io.to(data.to).emit("toggle-audio", { from: data.from, isEnabled: data.isEnabled });
    });

    socket.on("call-ended", (data) => {
        io.to(data.to).emit("callEnded", {
            name: data.name
        })
    })
    
    socket.on("disconnect", () => {
        console.log("Before disconnect online users:", onlineUsers);

        const disconnectedUser = onlineUsers.find(user => user.socketId === socket.id);
        if (disconnectedUser) {
          console.log("Before disconnect online users:", onlineUsers);
          onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
          console.log("After disconnect online users:", onlineUsers);
      
          // Broadcast updated list and disconnect info
          io.emit("update-online-users", onlineUsers);
          socket.broadcast.emit("disconnectUser", { disUser: disconnectedUser.userId });
        }
    
        console.log("After disconnect online users:", onlineUsers);
    })

}


export default SocketServer