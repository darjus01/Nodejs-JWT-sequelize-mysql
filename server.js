require('dotenv').config();

const express = require('express');
const app = express();
const { sequelize } = require('./models');

app.use(express.json());

// app.use('/auth', require('./routes/authRoutes'));
// app.use('/users', require('./routes/usersRoutes'));
app.use('/auth', require('./routes/authRoutes'));

app.use((err, req, res, next) => {
  console.log(err.stack);
  console.log(err.name);
  console.log(err.code);

  res.status(500).json(err);
});

const PORT = process.env.APP_PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port: ${PORT}`);

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
