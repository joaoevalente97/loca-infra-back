//Rotas na arquitetura REST
const express = require('express')
const router = express.Router()
const Item = require('../model/Item')
const { check, validationResult } = require('express-validator')

const validaItem = [
    check('x', 'Codigo X é obrigatorio!').notEmpty(),
    check('descricao', 'Descricao é obrigatoria e deve ser maior que 5 digitos!').isLength({ min: 5 }),
    check('quantidade', 'Quantidade é obrigatoria!').notEmpty(),
    check('quantidade', 'Quantidade deve ser um numero inteiro!').isInt(),
    check('locacao', 'Locacao é obrigatoria!').notEmpty(),
    check('locacao', 'Locacao deve conter apenas Letras e Numeros').isAlphanumeric()
]


router.get("/", async (req, res) => {
    try {
        const items = await Item.find()
        res.json(items)
    } catch (error) {
        res.status(500).send({
            errors: [{ message: `Não foi possível obter os itens😱: ${error.message}` }]
        })
    }
})

router.get("/:id", async (req, res) => {
    try {
        const item = await Item.findById(req.params.id)
        res.json(item)
    } catch (e) {
        res.status(500).send({
            errors: [{
                message: `Não foi possível obter o item com o id ${req.params.id}`
            }]
        })
    }
})

router.delete("/:id", async (req, res) => {
    await Item.findByIdAndRemove(req.params.id)
        .then(item => {
            res.send({ message: `Item ${item.titulo} removido com sucesso!` })
        }).catch(error => {
            return res.status(500).send({
                errors: [{ message: `Nao foi possivel remover o item com o id ${req.params.id}` }]
            })
        })
})

router.post()

module.exports = router