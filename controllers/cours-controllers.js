const { response } = require("express");
const { default: mongoose, mongo } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const HttpErreur = require("../models/http-erreur");

const Cours = require("../models/cours");
const professeur = require("../models/professeurs");

const getCoursById = async (requete, reponse, next) => {
    const coursId = requete.params.coursId;
    let cours;
    try {
      cours = await cours.findById(coursId);
    } catch (err) {
      return next(
        new HttpErreur("Erreur lors de la récupération de la cours", 500)
      );
    }
    if (!cours) {
      return next(new HttpErreur("Aucun cours trouvée pour l'id fourni", 404));
    }
    reponse.json({ cours: cours.toObject({ getters: true }) });
  };

  const getCoursByUserId = async (requete, reponse, next) => {
    const professeurId = requete.params.professeurId;
  
    let cours;
    try {
     let  professeur = await professeur.findById(professeurId).populate("cours");
    
    cours =  professeur.cours;
    console.log(professeur);
      
      //cours = await Place.find({ createur: professeurId });
    } catch (err) {
      return next(
        new HttpErreur(
          "Erreur lors de la récupération des cours du professeur",
          500
        )
      );
    }
  
    if (!cours || cours.length === 0) {
      return next(
        new HttpErreur("Aucune place trouvé pour le professeur fourni", 404)
      );
    }
  
    reponse.json({
      cours: cours.map((cours) => cours.toObject({ getters: true })),
    });
  };



exports.getCoursById = getCoursById;