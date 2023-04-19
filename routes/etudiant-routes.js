const express = require("express");

const controleursEtudiant = require("../controllers/etudiant-controllers")
const router = express.Router();

router.get('/', controleursEtudiant.getEtudiants);

router.post('/inscription', controleursEtudiant.inscription);

router.post('/connexion', controleursEtudiant.connexion);

router.post('/:etudiantId', controleursEtudiant.getEtudiantParId);

router.patch('/:etudiantId', controleursEtudiant.updateEtudiant);

router.delete('/:etudiantId', controleursEtudiant.supprimerEtudiant);

module.exports = router;