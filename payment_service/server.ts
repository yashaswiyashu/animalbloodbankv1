import app from './app';
import dotenv from 'dotenv';
import { connectDB } from './config/dbConfig';
dotenv.config();
connectDB();

app.listen(process.env.PORT, () => {
  console.log('Server is running on port ' + process.env.PORT);
});