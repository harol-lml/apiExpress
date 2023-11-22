import { Router } from 'express'
import { validateFilm, validateParcialFilm } from '../schemas/film.js'
import { FilmModel } from '../models/film.js'

export const filmRouter = Router()

filmRouter.get('/', async (req, res) => {
    const { genere } = req.query
    const films = await FilmModel.getAll({genere})

    res.json(films)
})

filmRouter.get('/:id', async (req, res) => {
    const {id} = req.params

    const film = await FilmModel.getById({ id })
    if (film) return res.json(film)

    res.status(404).json({message: "film no found"})
})

filmRouter.post('/', async (req,res) => {

    const result = validateFilm(req.body)

    if(result.error)
        return res.status(400).json({ error: JSON.parse(result.error.message) })

    const newFilm = await FilmModel.create({input: result.data})
    res.status(201).json(newFilm)
})

filmRouter.patch('/:id', async (req, res) => {
    const result = validateParcialFilm(req.body)

    if(!result.success) return res.status(404).json({error: JSON.parse(result.error.message)})

    const {id} = req.params
    const updateFilm = await FilmModel.update({input: result.data, id})

    if(!updateFilm) return res.status(404).json({message: 'Film not found'})
    return res.json(updateFilm)
})

filmRouter.delete('/:id', async (req, res) => {
    const {id} = req.params
    const film = await FilmModel.delete({ id })

    if (!film) return res.status(404).json({message: 'Film not found'})
    return res.json({message: 'Film deleted'})
})