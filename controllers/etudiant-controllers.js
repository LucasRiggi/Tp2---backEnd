const { v4: uuidv4 } = require("uuid");
const HttpErreur = require("../models/http-erreur");

const Etudiant = require("../models/etudiant");

const ETUDIANTS = [
  {
    id: "u1",
    nom: "Sylvain Labranche",
    courriel: "slabranche@cmontmorency.qc.ca",
    motDePasse: "test",
  },
];

const getEtudiants = async (requete, reponse, next) => {
  let Etudiant;

  try {
    etudiant = await Etudiant.find({}, "-motDePasse");
  } catch {
    return next(new HttpErreur("Erreur accès etudiant"), 500);
  }

  reponse.json({
    etudiants: etudiants.map(etudiants =>
        etudiants.toObject({ getters: true })
    ) });
};

const inscription = async (requete, reponse, next) => {
  const { nom, courriel, motDePasse, image } = requete.body;

  let etudiantExiste;

  try {
    etudiantExiste = await Etudiant.findOne({ courriel: courriel });
  } catch {
    return next(new HttpErreur("Échec vérification l'étudiant existe.", 500));
  }

  if (etudiantExiste) {
    return next(
      new HttpErreur("L'Étudiant existe déjà, veuillez vous connecter.", 422)
    );
  }

  let nouvelEtudiant = new Etudiant({
    nom,
    courriel,
    image,
    motDePasse,
    cours: [],
  });
  try {
    await nouvelEtudiant.save();
  } catch (err) {
    console.log(err);
    return next(new HttpErreur("Erreur lors de l'ajout de l'etudiant", 422));
  }
  reponse
    .status(201)
    .json({ etudiant: nouvelEtudiant.toObject({ getter: true }) });
};

const connexion = async (requete, reponse, next) => {
  const { courriel, motDePasse } = requete.body;

  let etudiantExiste;

  try {
    etudiantExiste = await Etudiant.findOne({ courriel: courriel });
  } catch {
    return next(
      new HttpErreur("Connexion échouée, veuillez réessayer plus tard", 500)
    );
  }

  if (!etudiantExiste || etudiantExiste.motDePasse !== motDePasse) {
    return next(new HttpErreur("Courriel ou mot de passe incorrect", 401));
  }

  reponse.json({ message: "connexion réussie!" });
};

exports.getEtudiants = getEtudiants;
exports.inscription = inscription;
exports.connexion = connexion;