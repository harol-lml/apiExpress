import { Router } from 'express'
import { FilmController } from '../controllers/films.js'

export const createFilmRouter = ({filmModel}) =>{
    const filmRouter = Router()
    const filmController = new FilmController ({filmModel})

    filmRouter.get('/', filmController.getAll)
    filmRouter.post('/', filmController.create)

    filmRouter.get('/:id', filmController.getById)
    filmRouter.patch('/:id', filmController.update)
    filmRouter.delete('/:id', filmController.delete)

    return filmRouter
}