const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
    titre:{type: String, required: true},
    description: {type: String, required: true},
    enseignant:{type: mongoose.Types.ObjectId, required: true, ref:"Professeur"}
});

module.exports = mongoose.model("Cours", placeSchema);