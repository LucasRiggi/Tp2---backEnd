const mongoose = require('mongoose');
const etudiant = require('./etudiant');


const Schema = mongoose.Schema;

const professeurSchema = new Schema({
    nom:{type: String, required: true},
    courriel: {type: String, required: true, unique:true},
    motDePasse: {type: String, required: true, minLength: 6},
    cours: [{type: mongoose.Types.ObjectId, required: true, ref:"Cours"}]
});



module.exports = mongoose.model("Professeur", professeurSchema);