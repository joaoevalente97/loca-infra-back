const express = require('express') //Carrega o express
require('dotenv').config() //Carrega as variaveis de ambiente
const InicializaMongoServer = require('./config/db')

//Rotas do nosso projeto backend
const rotasItem = require('./routes/Item')
const rotasLocacao = require('./routes/Locacao')

//Inicializamos o servidor MongoDB
InicializaMongoServer()

const app = express()
app.disable('x-powered-by') //remove o Powered-By Express

//Porta default do servidor web
const PORT = process.env.PORT

app.use(express.json()) // Iremos Fazer o PARSE do JSON

app.get('/', (req, res)=> {
    res.json({mensagem: 'API 100% funcional!', versao: '1.0.0'})
})

//Rotas relacionadas ao MongoDB
app.use('/items', rotasItem)
app.use('/locacao', rotasLocacao)

//Rota para tratar erros 404
app.use(function(req, res) {
    res.status(404).json({mensagem: `A rota ${req.originalUrl} informada não existe! 🤕`})
})

app.listen(PORT, (req, res) => {
    console.log(`Servidor Web rodando na porta ${PORT}💪`)
})