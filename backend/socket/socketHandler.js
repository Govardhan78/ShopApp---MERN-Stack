const Message = require('../models/Message');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (roomId) => {
      socket.join(roomId);
    });

    socket.on('send_message', async (data) => {
      const { senderId, receiverId, text } = data;
      const roomId = [senderId, receiverId].sort().join('_');

      try {
        const message = await Message.create({
          sender: senderId,
          receiver: receiverId,
          text,
          roomId
        });

        const populated = await message.populate('sender', 'name');
        io.to(roomId).emit('receive_message', populated);
      } catch (err) {
        console.error('Message save error:', err.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = socketHandler;
