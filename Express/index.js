import express, { json } from 'express'
import { createFilmRouter } from './reutes/films.js'
import { corsMiddleware } from './middlewares/cors.js'
// import filmJson from './film.json' with { type: 'json'}

export const createApp = ({filmModel}) => {
    const app = express()
    const PORT = process.env.PORT ?? 3000

    app.disable('x-powered-by')
    app.use(corsMiddleware());
    app.use(json())

    app.get('/', (req, res) => {
        res.json({hola: 'Pagina'})
    })

    app.use('/film', createFilmRouter({ filmModel }))

    app.use((req, res) => res.status(404).send('<h1>404</h1>'))

    app.listen(3000, () => {
        console.log(`server listening on http://localhost:${PORT}`)
    })
}