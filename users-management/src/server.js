import express from 'express';
import dotenv from 'dotenv';
import userRouter from './users/user-route.js';

dotenv.config();
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Users Managment API'
  });
});
app.use('/users', userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
});