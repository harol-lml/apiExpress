import { validateFilm, validateParcialFilm } from '../schemas/film.js'

export class FilmController {
    constructor ({filmModel}){
        this.filmModel = filmModel
    }

    getAll = async (req, res) => {
        const { genre } = req.query
        const films = await this.filmModel.getAll({genre})

        res.json(films)
    }

    getById = async (req, res) => {
        const {id} = req.params
        const film = await this.filmModel.getById({ id })

        if (film) return res.json(film)
        res.status(404).json({message: "film no found"})
    }

    create = async (req,res) => {
        const result = validateFilm(req.body)

        if(result.error)
            return res.status(400).json({ error: JSON.parse(result.error.message) })

        const newFilm = await this.filmModel.create({input: result.data})
        res.status(201).json(newFilm)
    }

    update = async (req, res) => {
        const result = validateParcialFilm(req.body)

        if(!result.success) return res.status(404).json({error: JSON.parse(result.error.message)})

        const {id} = req.params
        const updateFilm = await this.filmModel.update({input: result.data, id})

        if(!updateFilm) return res.status(404).json({message: 'Film not found'})
        return res.json(updateFilm)
    }

    delete = async (req, res) => {
        const {id} = req.params
        const film = await this.filmModel.delete({ id })

        if (!film) return res.status(404).json({message: 'Film not found'})
        return res.json({message: 'Film deleted'})
    }
}