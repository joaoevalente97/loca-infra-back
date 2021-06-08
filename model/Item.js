const mongoose = require("mongoose")

//Criando o schema Livro
const ItemSchema = mongoose.Schema({
    x: {type:String},
    descricao: {type:String},
    quantidade: {type:String},
    locacao: {type:String}
},{timestamps: true})

module.exports = mongoose.model('item', ItemSchema)