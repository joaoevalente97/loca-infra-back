const mongoose = require('mongoose')

const MONGOURI = process.env.DATABASE_URL

const InicializaMongoServer = async() => {
    try{
        await mongoose.connect(MONGOURI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        console.log("Node🤝MongoDB - Conexão realizada com sucesso")
    }catch(e){
        console.error(e)
        throw e
    }
}

module.exports = InicializaMongoServer