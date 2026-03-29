import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { chatRoute } from './routes/chat.js';
import { ttsRoute } from './routes/tts.js';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/chat', chatRoute);
app.use('/api/tts', ttsRoute);

app.listen(PORT, () => {
  console.log(`Panpan server running on http://localhost:${PORT}`);
});
