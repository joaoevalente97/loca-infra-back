const mongoose = require("mongoose")

//Criando o schema Livro
const LocacaoSchema = mongoose.Schema({
    codigo: {type:String},
    conteiner: {type:String},
    instalacao: {tyoe:String}
},{timestamps: true})

module.exports = mongoose.model('locacao', LocacaoSchema)