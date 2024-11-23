// Load environment variables
require('dotenv').config();

//Dependecies
const app = require('./src/app');
const connectDB = require('./src/config/db.js');

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

