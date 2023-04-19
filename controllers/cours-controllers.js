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
    cours = await Cours.findById(coursId);
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

const getCoursByProfesseurId = async (requete, reponse, next) => {
  const professeurId = requete.params.professeurId;

  let cours;
  try {
    let professeur = await Professeur.findById(professeurId).populate("cours");

    cours = professeur.cours;
    console.log(cours);
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

const getCours = async (requete, reponse, next) => {
  let cours;

  try {
    cours = await Cours.find({}, "-motDePasse");
  } catch {
    return next(new HttpErreur("Erreur accès etudiant"), 500);
  }

  reponse.json({
    cours: cours.map(cour =>
      cour.toObject({ getters: true })
    )
  });

}

const creerCours = async (requete, reponse, next) => {
  const {titre, description, enseignant} = requete.body;
  const nouveauCours = new Cours({
    titre,
    description,
    enseignant,
    etudiants:[]
  });

  let professeur;

  try {
    professeur = await Professeur.findById(enseignant);

  } catch {

    return next(new HttpErreur("Création de cours échouée", 500));
  }

  if (!professeur) {
    return next(new HttpErreur("professeur non trouvé selon le id"), 504);
  }

  try {

    
    await nouveauCours.save();

    professeur.cours.push(nouveauCours);
    await professeur.save();

  } catch (err) {
    const erreur = new HttpErreur("Création de cours échouée", 500);
    return next(erreur);
  }
  reponse.status(201).json({ cours: nouveauCours });
};

const updateCours = async (requete, reponse, next) => {
  const { titre, description } = requete.body;
  const coursId = requete.params.coursId;

  let cours;

  try {
    cours = await Cours.findById(coursId);
    cours.titre = titre;
    cours.description = description;
    await cours.save();
  } catch {
    return next(
      new HttpErreur("Erreur lors de la mise à jour de la cours", 500)
    );
  }

  reponse.status(200).json({ cours: cours.toObject({ getters: true }) });
};

const supprimerCours = async (requete, reponse, next) => {
  const coursId = requete.params.coursId;
  let cours;
  try {

    cours = await Cours.findById(coursId).populate("professeur");

  } catch {

    return next(
      new HttpErreur("Erreur lors de la suppression de le cours", 500)
    );

  }
  if (!cours) {
    return next(new HttpErreur("Impossible de trouver le cours", 404));
  }

  try {
    console.log("Chems")
    await cours.remove();
    console.log("Lucas the Lucas")
    cours.professeur.cours.pull(cours);
    cours.etudiants.map(etudiant =>
      etudiant.cours.pull(cours))
    await cours.professeur.save()

  } catch {
    return next(
      new HttpErreur("Erreur lors de la suppression de la cours", 500)
    );
  }
  reponse.status(200).json({ message: "cours supprimée" });
};


exports.getCours = getCours;
exports.getCoursById = getCoursById;
exports.getCoursByProfesseurId = getCoursByProfesseurId;
exports.creerCours = creerCours;
exports.updateCours = updateCours;
exports.supprimerCours = supprimerCours;