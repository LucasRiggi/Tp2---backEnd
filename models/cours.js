const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const coursSchema = new Schema({
    titre:{type: String, required: true},
    description: {type: String, required: true},
    enseignant:{type: mongoose.Types.ObjectId, required: true, ref:"Professeur"},
    etudiants:[{type: mongoose.Types.ObjectId, required: true, ref:"Etudiant"}]
});

module.exports = mongoose.model("Cours", coursSchema);