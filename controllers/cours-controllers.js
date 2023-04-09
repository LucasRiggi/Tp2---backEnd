const { response } = require("express");
const { default: mongoose, mongo } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const HttpErreur = require("../models/http-erreur");

const Cours = require("../models/cours");
const Professeur = require("../models/professeurs");

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
    let professeur = await professeur.findById(professeurId).populate("cours");

    cours = professeur.cours;
    console.log(professeur);

    //cours = await cours.find({ createur: professeurId });
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
      new HttpErreur("Aucune cours trouvé pour le professeur fourni", 404)
    );
  }

  reponse.json({
    cours: cours.map((cours) => cours.toObject({ getters: true })),
  });
};

const creerCours = async (requete, reponse, next) => {
  const { titre, description, enseignant } = requete.body;
  const nouveauCours = new Cours({
    titre,
    description,
    enseignant
  });

  let professeur;

  try {
    professeur = await Professeur.findById(createur);

  } catch {

    return next(new HttpErreur("Création de cours échouée", 500));
  }

  if (!professeur) {
    return next(new HttpErreur("professeur non trouvé selon le id"), 504);
  }

  try {


    await nouveauCours.save();
    //Ce n'est pas le push Javascript, c'est le push de mongoose qui récupe le id de la cours et l'ajout au tableau de l'professeur
    professeur.cours.push(nouveauCours);
    await professeur.save();
    //Une transaction ne crée pas automatiquement de collection dans mongodb, même si on a un modèle
    //Il faut la créer manuellement dans Atlas ou Compass
  } catch (err) {
    const erreur = new HttpErreur("Création de cours échouée", 500);
    return next(erreur);
  }
  reponse.status(201).json({ cours: nouvellecours });
};



exports.getCoursById = getCoursById;
exports.getCoursByUserId = getCoursByUserId;