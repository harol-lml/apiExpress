// import { FilmModel } from '../models/local-file-system/film.js'
// import { FilmModel } from '../models/database/film.js'
import { FilmModel } from '../models/mysql/film.js'

import { validateFilm, validateParcialFilm } from '../schemas/film.js'

export class FilmController {
    static async getAll (req, res) {
        const { genre } = req.query
        const films = await FilmModel.getAll({genre})

        res.json(films)
    }

    static async getById (req, res) {
        const {id} = req.params
        const film = await FilmModel.getById({ id })

        if (film) return res.json(film)
        res.status(404).json({message: "film no found"})
    }

    static async create (req,res) {
        const result = validateFilm(req.body)

        if(result.error)
            return res.status(400).json({ error: JSON.parse(result.error.message) })

        const newFilm = await FilmModel.create({input: result.data})
        res.status(201).json(newFilm)
    }

    static async update (req, res) {
        const result = validateParcialFilm(req.body)

        if(!result.success) return res.status(404).json({error: JSON.parse(result.error.message)})

        const {id} = req.params
        const updateFilm = await FilmModel.update({input: result.data, id})

        if(!updateFilm) return res.status(404).json({message: 'Film not found'})
        return res.json(updateFilm)
    }

    static async delete (req, res) {
        const {id} = req.params
        const film = await FilmModel.delete({ id })

        if (!film) return res.status(404).json({message: 'Film not found'})
        return res.json({message: 'Film deleted'})
    }
}