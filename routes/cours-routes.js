const express = require("express");

const controleursCours = require("../controllers/cours-controllers");
const router = express.Router();

router.get("/:coursId", controleursCours.getCoursById);

router.get("/professeurs/:professeurId", controleursCours.getCoursByProfesseurId);

router.post('/', controleursCours.creerCours);

router.patch('/:coursId', controleursCours.updateCours);

router.delete('/:coursId', controleursCours.supprimerCours);

module.exports = router;



