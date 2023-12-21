const express =  require('express');
const controller = require('../controllers/controllers');
// La variable contient l'instance du routeur
const router = express.Router();  

// Liste des routes utilisables pour Patient
router.get('/',controller.quiz);
router.get('/main.ejs',controller.home);
router.get('/ubisoft.ejs',controller.ubisoft);
router.get('*',controller.Error);

module.exports = router;