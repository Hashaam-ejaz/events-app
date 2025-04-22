const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const artistRoutes = require('./routes/artists');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/artists', artistRoutes);


app.get("/", (req, res) => {
  res.send("Club Event API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
