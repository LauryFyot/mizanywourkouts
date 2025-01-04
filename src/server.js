// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const { Sequelize, DataTypes } = require('sequelize');

// // Configuration de la base PostgreSQL
// const sequelize = new Sequelize('workout_db', 'username', 'password', {
//   host: 'localhost',
//   dialect: 'postgres',
// });

// // Modèle Utilisateur
// const User = sequelize.define('User', {
//   username: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// });

// // Modèle Exercise
// const Exercise = sequelize.define('Exercise', {
//   userId: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   duration: {
//     type: DataTypes.STRING,
//   },
//   repetitions: {
//     type: DataTypes.INTEGER,
//   },
// });

// // Relations
// User.hasMany(Exercise);
// Exercise.belongsTo(User);

// // Synchronisation avec la base
// sequelize.sync();

// // Express app
// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // Route d'inscription
// app.post('/register', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = await User.create({ username, password });
//     res.json(user);
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });

// // Route de connexion
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   const user = await User.findOne({ where: { username, password } });
//   if (user) {
//     res.json({ success: true, userId: user.id });
//   } else {
//     res.status(401).json({ success: false, message: 'Invalid credentials' });
//   }
// });

// // Route pour récupérer les exercices
// app.get('/exercises/:userId', async (req, res) => {
//   const exercises = await Exercise.findAll({ where: { userId: req.params.userId } });
//   res.json(exercises);
// });

// // Lancer le serveur
// app.listen(5000, () => {
//   console.log('Server running on http://localhost:5000');
// });


const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(5000, () => {
  console.log('Server started on http://localhost:5000');
});
