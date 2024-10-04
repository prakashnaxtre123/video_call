const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://prakashnaxtre:sahoo1234@cluster1.mg62mzw.mongodb.net/video_call_app');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;
