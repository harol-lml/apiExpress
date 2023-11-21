import express, { json } from 'express'
// import filmJson from './film.json' with { type: 'json'}
import { randomUUID } from 'node:crypto'
import cors from 'cors'
import { validateFilm, validateParcialFilm } from './schemas/film.js'

import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const filmJson = require('./film.json')
const app = express()

const PORT = process.env.PORT ?? 3000

app.disable('x-powered-by')
app.use(cors());
app.use(json())
/* app.use((req, res, next) => {
    if(req.method !== 'POST') return next()

    let body = ''
    req.on('data', chunk => {
        body += chunk.toString()
    })
    req.on('end', () => {
        const data = JSON.parse(body)
        data.timestamp = Date.now()
        req.body = data
        next()
    })
}) */

app.get('/', (req, res) => {
    res.json({hola: 'Pagina'})
})

app.get('/film', (req, res) => {
    const { genere } = req.query
    if(genere){
        const filter = filmJson.filter(
            film => film.genre.some(g => g.toLocaleLowerCase() === genere.toLocaleLowerCase())
        )

        return res.json(filter)
    }
    res.json(filmJson)
})

app.get('/film/:id', (req, res) => {
    const {id} = req.params

    const film = filmJson.find(film => film.id == id)
    if (film) return res.json(film)

    res.status(404).json({message: "film no found"})
})

app.post('/film', (req,res) => {

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

app.patch('/film/:id', (req, res) => {
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

app.delete('/film/:id', (req, res) => {
    const {id} = req.params
    const filmIndex = filmJson.findIndex(f => f.id === id)

    if(filmIndex === -1) return res.status(404).json({message: 'Film not found'})

    filmJson.splice(filmIndex, 1)

    return res.json({message: 'Film deleted'})
})

/* app.options('film/:id', (req, res) =>{
    res.header('Access-Control-Allow-Origin','http://localhost:5500')
    res.header('Access-Control-Allow-Methods','DELETE, GET, POST, PUT, PATCH')
    res.send(200)
}) */

app.use((req, res) => res.status(404).send('<h1>404</h1>'))

app.listen(3000, () => {
    console.log(`server listening on http://localhost:${PORT}`)
})