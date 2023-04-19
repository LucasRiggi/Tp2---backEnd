const { v4: uuidv4 } = require("uuid");
const HttpErreur = require("../models/http-erreur");

const Professeur = require("../models/professeurs");

const PROFESSEUR = [
  {
    id: "u1",
    nom: "Sylvain Labranche",
    courriel: "slabranche@cmontmorency.qc.ca",
    motDePasse: "test",
    cours:["web et bases de données"]
  }
];

const getProfesseur = async (requete, reponse, next) => {
  let professeur;

  try {
    professeur = await Professeur.find({}, "-motDePasse");
  } catch {
    return next(new HttpErreur("Erreur accès professeur"), 500);
  }

  reponse.json({
    professeur: professeur.map(professeur =>
      professeur.toObject({ getters: true })
    ) });
};

const inscription = async (requete, reponse, next) => {
  const { nom, courriel, motDePasse, cours } = requete.body;

  let professeurExiste;

  try {
    professeurExiste = await Professeur.findOne({ courriel: courriel });
  } catch {
    return next(new HttpErreur("Échec vérification du professeur existe", 500));
  }

  if (professeurExiste) {
    return next(
      new HttpErreur("Professeur existe déjà, veuillez vos connecter", 422)
    );
  }

  const nouveauProfesseur = new Professeur({
    nom,
    courriel,
    motDePasse,
    cours
  });
  
  try {
    await nouveauProfesseur.save();
  } catch (err) {
    console.log(err);
    return next(new HttpErreur("Erreur lors de l'ajout du professeur", 422));
  }
  reponse
    .status(201)
    .json({ professeur: nouveauProfesseur.toObject({ getter: true }) });
};

const connexion = async (requete, reponse, next) => {
  const { courriel, motDePasse } = requete.body;

  let professeurExiste;

  try {
    professeurExiste = await Professeur.findOne({ courriel: courriel });
  } catch {
    return next(
      new HttpErreur("Connexion échouée, veuillez réessayer plus tard", 500)
    );
  }

  if (!professeurExiste || professeurExiste.motDePasse !== motDePasse) {
    return next(new HttpErreur("Courriel ou mot de passe incorrect", 401));
  }

  reponse.json({ message: "connexion réussie!" });
};

exports.getProfesseur = getProfesseur;
exports.inscription = inscription;
exports.connexion = connexion;