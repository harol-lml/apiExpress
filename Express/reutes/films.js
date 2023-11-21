import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { validateFilm, validateParcialFilm } from '../schemas/film.js'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const filmJson = require('../film.json')

export const filmRouter = Router()

filmRouter.get('/', (req, res) => {
    const { genere } = req.query
    if(genere){
        const filter = filmJson.filter(
            film => film.genre.some(g => g.toLocaleLowerCase() === genere.toLocaleLowerCase())
        )

        return res.json(filter)
    }
    res.json(filmJson)
})

filmRouter.get('/:id', (req, res) => {
    const {id} = req.params

    const film = filmJson.find(film => film.id == id)
    if (film) return res.json(film)

    res.status(404).json({message: "film no found"})
})

filmRouter.post('/', (req,res) => {

    const result = validateFilm(req.body)

    if(result.error)
        return res.status(400).json({ error: JSON.parse(result.error.message) })

    const newFilm = {
        id: randomUUID(), // crea uuid en version 4
        ...result.data
    }
    filmJson.push(newFilm)
    res.status(201).json(newFilm)
})

filmRouter.patch('/:id', (req, res) => {
    const result = validateParcialFilm(req.body)

    if(!result.success) return res.status(404).json({error: JSON.parse(result.error.message)})

    const {id} = req.params
    const filmIndex = filmJson.findIndex(f => f.id === id)

    if(filmIndex === -1) return res.status(404).json({message: 'Film not found'})

    const updateFilm = {
        ...filmJson[filmIndex],
        ...result.data
    }

    filmJson[filmIndex] = updateFilm

    return res.json(updateFilm)
})

filmRouter.delete('/:id', (req, res) => {
    const {id} = req.params
    const filmIndex = filmJson.findIndex(f => f.id === id)

    if(filmIndex === -1) return res.status(404).json({message: 'Film not found'})

    filmJson.splice(filmIndex, 1)

    return res.json({message: 'Film deleted'})
})