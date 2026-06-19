import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import digestRoutes from './routes/digestRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Mount our MVC routes
app.use('/api', digestRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Digester Engine running on port ${PORT}`);
});