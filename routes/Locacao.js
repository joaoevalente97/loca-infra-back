//Rotas na arquitetura REST
const express = require('express')
const router = express.Router()
const Locacao = require('../model/Locacao')
const { check, validationResult } = require('express-validator')

//Valida se o documento passado na requisição atende aos requisitos
const validaLocacao = [
    check('codigo', 'Codigo é obrigatorio!').notEmpty(),
    check('codigo', 'codigo deve conter apenas Letras e Numeros').isAlphanumeric(),
    check('container', 'Container é obrigatorio e deve ser maior que 5 digitos!').isLength({ min: 5 }),
    check('instalacao', 'Instalacao é obrigatoria e deve ser maior que 5 digitos!').isLength({ min: 5 }),
]

//Retorna todos os documentos na collection
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

//Retorna um documento especificado pelo id
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

//Inclui um novo documento
router.post('/', validaLocacao,
async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
            })
        }
        //Verifica se o documento já existe
        const { codigo } = req.body
        let locacao = await Locacao.findOne({ codigo })
        if (locacao)
        return res.status(200).json({ errors: [{ message: 'Já existe uma locacao com o codigo informado!' }] })
        try {
            let locacao = new Locacao(req.body)
            await locacao.save()
            res.send(locacao)
        } catch (err) {
            return res.status(500).json({
                errors: [{ message: `Erro ao salvar a locacao: ${err.message}` }]
            })
        }
    })

    
    router.put('/', validaLocacao,
    async(req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }
        let dados = req.body
        await Locacao.findByIdAndUpdate(req.body._id, {
            $set: dados
        },{new: true})
        .then(locacao => {
            res.send({message: `Locacao ${locacao.codigo} alterada com sucesso!`})
    }).catch(err => {
        return res.status(500).send({
            errors: [{
                message:`Não foi possível alterar a locacao com o id ${req.body._id}`}]
            })
        })
    })
    
    //Remove um documento espeficicado pelo id
    router.delete("/:id", async (req, res) => {
        await Locacao.findByIdAndRemove(req.params.id)
            .then(locacao => {
                res.send({ message: `Locacao ${locacao.codigo} removido com sucesso!` })
            }).catch(error => {
                return res.status(500).send({
                    errors: [{ message: `Nao foi possivel remover a locacao com o id ${req.params.id}` }]
                })
            })
    })
    
    module.exports = router