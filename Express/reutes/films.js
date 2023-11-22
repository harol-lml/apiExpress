import { Router } from 'express'
import { FilmController } from '../controllers/films.js'

export const filmRouter = Router()

filmRouter.get('/', FilmController.getAll)
filmRouter.post('/', FilmController.create)

filmRouter.get('/:id', FilmController.getById)
filmRouter.patch('/:id', FilmController.update)
filmRouter.delete('/:id', FilmController.delete)