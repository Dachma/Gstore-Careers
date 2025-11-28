import express from 'express';
import cors from 'cors';
import applyRoutes from './routes/apply.js';

const app = express();

app.use(cors());
app.use(express.json());

// serve uploaded PDFs
app.use('/uploads', express.static('uploads'));

// routes
app.use('/apply', applyRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});