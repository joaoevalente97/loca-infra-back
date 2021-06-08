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

//Retorna todos os documentos na collection
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

//Retorna um documento especificado pelo id
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id)
        res.json(item)
    } catch (e) {
        res.status(500).send({
            errors: [{
                message: `Não foi possível obter a item com o id ${req.params.id}`
            }]
        })
    }
})

//Inclui um novo documento
router.post('/', validaItem,
async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
            })
        }
        //Verifica se o documento já existe
        const { x } = req.body
        let item = await Item.findOne({ x })
        if (item)
        return res.status(200).json({ errors: [{ message: 'Já existe um item com o x informado!' }] })
        try {
            let item = new Item(req.body)
            await item.save()
            res.send(item)
        } catch (err) {
            return res.status(500).json({
                errors: [{ message: `Erro ao salvar a item: ${err.message}` }]
            })
        }
    })

    //Altera um documento
    router.put('/', validaItem,
    async(req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
        })
    }
    let dados = req.body
    await Item.findByIdAndUpdate(req.body._id, {
        $set: dados
    },{new: true})
    .then(item => {
        res.send({message: `Item X-${item.x} alterado com sucesso!`})
    }).catch(err => {
        return res.status(500).send({
            errors: [{
                message:`Não foi possível alterar o item com o id ${req.body._id}`}]
            })
    })
})

//Remove um documento espeficicado pelo id
router.delete("/:id", async (req, res) => {
    await Item.findByIdAndRemove(req.params.id)
        .then(item => {
            res.send({ message: `Item X-${item.x} removido com sucesso!` })
        }).catch(error => {
            return res.status(500).send({
                errors: [{ message: `Nao foi possivel remover a item com o id ${req.params.id}` }]
            })
        })
})

module.exports = router