const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const professeurSchema = new Schema({
    nom:{type: String, required: true},
    courriel: {type: String, required: true, unique:true},
    motDePasse: {type: String, required: true, minLength: 6},
    image: {type: String, required: true},
    cours: [{type: mongoose.Types.ObjectId, required: true, ref:"Place"}]
});



module.exports = mongoose.model("etudiant", professeurSchema);