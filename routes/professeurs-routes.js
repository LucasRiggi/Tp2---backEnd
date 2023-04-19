const express = require("express");

const controleursProfesseur = require("../controllers/professeurs-controllers")
const router = express.Router();

router.get('/', controleursProfesseur.getProfesseur);

router.post('/inscription', controleursProfesseur.inscription);

router.post('/connexion', controleursProfesseur.connexion);

router.patch('/:professeurId', controleursProfesseur.updateProf);

router.delete('/:professeurId', controleursProfesseur.supprimerProfesseur);

module.exports = router;