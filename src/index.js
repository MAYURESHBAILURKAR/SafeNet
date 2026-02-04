// index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Import Mongoose
const userRouter = require('./features/users/users.router')
const authRouter = require('./features/auth/auth.router')
const folderRouter = require('./features/folder/folder.router');
const fileRouter = require('./features/fileUpload/files.router');
require('dotenv').config(); // Load environment variables


// Import Models (Just to verify they load correctly)

const fileSchema = require('./features/fileUpload/files.schema');

const app = express();
const PORT = process.env.PORT || 8080; // Use port from .env or default to 8080

// Middleware
app.use(cors());
app.use(express.json());
app.use('/users',userRouter)
app.use('/auth', authRouter);
app.use('/folders', folderRouter);
app.use('/files', fileRouter);
// Connect to MongoDB

const connect = ()=>{
    return mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('✅ MongoDB Connected Successfully'))
//   .catch((err) => console.error('❌ MongoDB Connection Error:', err));
}



// Routes
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(PORT, async () => {
  await connect()
  console.log(`Server is running`);
});