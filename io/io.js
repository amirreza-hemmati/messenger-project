const Users = require("./../models/Users");
const Messages = require("./../models/Messages");

class SocketIo {
  constructor(io, users) {
    this.io = io;
    this.users = users;
    this.socket = null;
    this.connection();
  }

  connection() {
    this.io.on("connection", socket => {
      this.getStarted(socket);
    });
  }

  getStarted(socket) {
    socket.on("getStarted", information => {
      const { user_id } = information;
      if (this.validateUserId(user_id)) {
        this.setStateUser(user_id, true)
          .then(() => {
            this.io.emit("stateUser", { isTyping: true, user_id });
            this.disConnect(user_id, socket);
            this.findUserByUserId(user_id, socket);
          })
          .catch(error => {
            console.log(error);
            this.io.emit("isError", this.error("has error to oflinning user"));
          });
      } else {
        socket.emit("isError", this.error(`${user_id} invalid a number`));
      }
    });
  }

  validateUserId(user_id) {
    if (typeof user_id !== "number") {
      return false;
    }
    return true;
  }

  findUserByUserId(id, socket) {
    Users.findOne({ user_id: id })
      .then(user => {
        if (!user) {
          socket.emit("isError", this.error("user not found"));
        } else {
          this.keyUpUser(id, socket);
          this.getDataUser(user.user_id, socket)
            .then(messages => {
              socket.emit("messages", {
                messages,
                success: true
              });
            })
            .catch(error => {
              console.log(error);
              this.error("has error to get messages");
            });
          this.sendMessage(user.user_id, socket);
          this.setIsRead(socket);
        }
      })
      .catch(error => {
        socket.emit("isError", this.error("no validate"));
        console.log(error);
      });
  }

  sendMessage(from_user, socket) {
    socket.on("sendMessage", message => {
      const { to_user, text, isRead, reply } = message;
      const newMessage = new Messages({
        from_user,
        to_user,
        text,
        isRead,
        reply,
		type
      });
	  
	  if(type === "string"){
      newMessage.save()
        .then(newMessage => {
            socket.broadcast.emit("newMessage", {
              isMee: false,
              from_user,
              to_user,
              text,
              isRead,
              reply,
			  type
            });
            socket.emit("newMessage", {
              isMee: true,
              from_user,
              to_user,
              text,
              isRead,
              reply,
			  type
            });
        })
        .catch(error => {
            console.log(error);
            socket.emit('isError', this.error("has error in send message"));
        });  
	  }
    });
  }

  setIsRead(socket){
      socket.on("isRead", data => {
          Messages.findByIdAndUpdate(data._id, { isRead: data.isRead })
          .then(() => {
            socket.broadcast.emit("isRead", data);
          })
          .catch(() => {
            socket.emit("isError", this.error("no validate"));
            console.log(error);
          });
      });
  }

  keyUpUser(user_id, socket) {
    socket.on("keyUp", state => {
      socket.broadcast.emit("keyUp", {state: state.state, user_id});
    });
  }

  getDataUser(user_id) {
    return Messages.findOne({
      $or: [{ from_user: user_id }, { to_user: user_id }]
    });
  }

  error(error) {
    return { error, success: false };
  }

  setStateUser(user_id, state) {
    return Users.findOneAndUpdate({ user_id }, { state: state, user_id });
  }

  disConnect(user_id, socket) {
    socket.on("disconnect", () => {
      this.setStateUser(user_id, false)
        .then(() => this.io.emit("stateUser", { state: false, user_id }))
        .catch(error => {
          console.log(error);
          this.io.emit("isError", this.error("has error to oflinning user"));
        });
    });
  }
}

module.exports = SocketIo;
