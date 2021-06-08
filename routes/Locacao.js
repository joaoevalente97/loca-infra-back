//Rotas na arquitetura REST
const express = require('express')
const router = express.Router()
const Locacao = require('../model/Locacao')
const { check, validationResult} = require('express-validator')

const validaLocacao = [
    check('codigo', 'Codigo é obrigatorio!').notEmpty(),
    check('codigo', 'codigo deve conter apenas Letras e Numeros').isAlphanumeric(),
    check('container', 'Container é obrigatorio e deve ser maior que 5 digitos!').isLength({ min: 5 }),
    check('instalacao', 'Instalacao é obrigatoria e deve ser maior que 5 digitos!').isLength({ min: 5 }),
]


router.get("/", async (req, res) => {
    try {
        const locacaos = await Locacao.find()
        res.json(locacaos)
    } catch (error) {
        res.status(500).send({
            errors: [{ message: `Não foi possível obter os itens😱: ${error.message}` }]
        })
    }
})

router.get("/:id", async (req, res) => {
    try {
        const locacao = await Locacao.findById(req.params.id)
        res.json(locacao)
    } catch (e) {
        res.status(500).send({
            errors: [{
                message: `Não foi possível obter a locacao com o id ${req.params.id}`
            }]
        })
    }
})

router.delete("/:id", async (req, res) => {
    await Locacao.findByIdAndRemove(req.params.id)
        .then(locacao => {
            res.send({ message: `Locacao ${locacao.titulo} removido com sucesso!` })
        }).catch(error => {
            return res.status(500).send({
                errors: [{ message: `Nao foi possivel remover a locacao com o id ${req.params.id}` }]
            })
        })
})

router.post()

module.exports = router