const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rohanRouter = require('./routes/rohanRouter');
const shravanRouter = require('./routes/shravanRouter');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', rohanRouter);
app.use('/api', shravanRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
