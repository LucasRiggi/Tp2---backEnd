const { v4: uuidv4 } = require("uuid");
const HttpErreur = require("../models/http-erreur");

const Etudiant = require("../models/etudiant");

const ETUDIANTS = [
  {
    id: "u1",
    nom: "Lucas Ranon",
    courriel: "Ranon@cmontmorency.qc.ca",
    motDePasse: "test"
  },
];

const getEtudiants = async (requete, reponse, next) => {
  let etudiant;

  try {
    etudiant = await Etudiant.find({}, "-motDePasse");
  } catch {
    return next(new HttpErreur("Erreur accès etudiant"), 500);

  }

  reponse.json({
    etudiant: etudiant.map(etudiant =>
        etudiant.toObject({ getters: true })
    ) });
};

const getEtudiantParId = async (requete, reponse, next) => {
  const etudiantId = requete.params.etudiantId;

  let etudiant;
  try {
    etudiant = await Etudiant.findById(etudiantId);
  } catch (err) {
    return next(
      new HttpErreur("Erreur lors de la récupération de l'étudiant", 500)
    );
  }
  if (!etudiant) {
    return next(new HttpErreur("Aucun étudiant trouvée pour l'id fourni", 404));
  }
  reponse.json({ etudiant: etudiant.toObject({ getters: true }) });


}

const inscription = async (requete, reponse, next) => {
  const { nom, courriel, motDePasse, cours} = requete.body;

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
    motDePasse,
    cours
  });
  
  try {
    await nouvelEtudiant.save();
    nouvelEtudiant.cours.map(cour => 
      cour.etudiants.push(nouvelEtudiant));
    console.log("Lucas")
    await nouvelEtudiant.cours;
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

const updateEtudiant = async (requete, reponse, next) => {
  const { titre, description, courriel, motDePasse, cours} = requete.body;
  const etudiantId = requete.params.etudiantId;

  let etudiant;

  try {
    etudiant = await Etudiant.findById(etudiantId);
    etudiant.titre = titre;
    etudiant.description = description;
    etudiant.courriel = courriel;
    etudiant.motDePasse = motDePasse;
    etudiant.cours = cours;
    await etudiant.save();
  } catch {
    return next(
      new HttpErreur("Erreur lors de la mise à jour de la cours", 500)
    );
  }

  reponse.status(200).json({ etudiant: etudiant.toObject({ getters: true }) });
};

const supprimerEtudiant = async (requete, reponse, next) => {
  const etudiantId = requete.params.coursId;
  let etudiant;
  try {

    etudiant = await Etudiant.findById(etudiantId);

  } catch {

    return next(
      new HttpErreur("Erreur lors de la suppression de le cours", 500)
    );

  }
  if (!etudiant) {
    return next(new HttpErreur("Impossible de trouver le cours", 404));
  }

  try {

    await etudiant.remove();
    etudiant.cours.map(cour => 
      cour.etudiants.pull(etudiant));
    await etudiant.cours.save()

  } catch {
    return next(
      new HttpErreur("Erreur lors de la suppression de la cours", 500)
    );
  }
  reponse.status(200).json({ message: "cours supprimée" });
};



exports.getEtudiants = getEtudiants;
exports.inscription = inscription;
exports.connexion = connexion;
exports.getEtudiantParId = getEtudiantParId;
exports.updateEtudiant = updateEtudiant;
exports.supprimerEtudiant = supprimerEtudiant;