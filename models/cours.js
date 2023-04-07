const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
    id:{},
    titre:{type: String, required: true},
    description: {type: String, required: true},
    professeur:{type: mongoose.Types.ObjectId, required: true, ref:"Professeur"}
});

module.exports = mongoose.model("Place", placeSchema);