
// Recuperation des modules
const express = require('express');
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');

const routes = require('./routes/routes.js');


// Initialisation de l'instance ExpressJS
const app = express();

// Definition du chemin des vues
app.set("views",path.resolve(__dirname,'views'));
app.use(express.static('public'));
app.use(express.static('node_modules'));


// Utilisation de EJS
app.set('view engine', 'ejs');

// Configuration du traitement des formulaires de requete HTTP
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Gestion des routes
app.use('/',routes);

// Définition du port de l'application
const port = process.env.port || 3000;

// Demmarge de l'app
app.listen(port, () => console.log('Le serveur est démarré sur le port : ' +port));

// Export de l'app
module.exports = app;
