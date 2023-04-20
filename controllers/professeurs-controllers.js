const { v4: uuidv4 } = require("uuid");
const HttpErreur = require("../models/http-erreur");

const Professeur = require("../models/professeurs");

const PROFESSEUR = [
  {
    id: "u1",
    nom: "Diego rigi",
    courriel: "Drigi@cmontmorency.qc.ca",
    motDePasse: "test",
    cours:["web et bases de données"]
  }
];

const getProfesseurParId = async (requete, reponse, next) => {
  const professeurId = requete.params.professeurId;

  let professeur;
  try {
    professeur = await Etudiant.findById(professeurId);
  } catch (err) {
    return next(
      new HttpErreur("Erreur lors de la récupération du professeur", 500)
    );
  }
  if (!professeur) {
    return next(new HttpErreur("Aucun professeur trouvée pour l'id fourni", 404));
  }
  reponse.json({ professeur: professeur.toObject({ getters: true }) });


}

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
  const { nom, courriel, motDePasse } = requete.body;

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
    cours:[]
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

const updateProf = async (requete, reponse, next) => {
  const { nom, courriel, motDePasse,  cours} = requete.body;
  const professeurId= requete.params.professeurId;

  let professeur;

  try {
    professeur = await Professeur.findById(professeurId);
    professeur.nom = nom;
    professeur.courriel = courriel;
    professeur.motDePasse = motDePasse;
    professeur.cours = cours;
    await professeur.save();
  } catch {
    return next(
      new HttpErreur("Erreur lors de la mise à jour du cours", 500)
    );
  }

  reponse.status(200).json({ professeur: professeur.toObject({ getters: true }) });
};

const supprimerProfesseur = async (requete, reponse, next) => {
  const professeurId = requete.params.professeurId;
  let professeur;
  try {

    professeur = await Professeur.findById(professeurId);
    console.log("Good ");
  } catch {

    return next(
      new HttpErreur("Erreur lors de la suppression du professeur", 500)
    );

  }
  if (!professeur) {
    return next(new HttpErreur("Impossible de trouver le professeur", 404));
  }

  try {
    console.log("Good 2");
    await professeur.remove();

  } catch {
    return next(
      new HttpErreur("Erreur lors de la suppression du professeur", 500)
    );
  }
  reponse.status(200).json({ message: "cours supprimée" });
};

exports.getProfesseur = getProfesseur;
exports.inscription = inscription;
exports.connexion = connexion;
exports.getProfesseurParId = getProfesseurParId;updateProf
exports.updateProf = updateProf;
exports.supprimerProfesseur = supprimerProfesseur;