const express = require('express')
const filmJson = require('./film.json')
const app = express()

const PORT = process.env.PORT ?? 3000

app.disable('x-powered-by')

app.use(express.json())
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

app.post('/dogs', (req,res) => {
    res.status(201).json(req.body)
})

app.use((req, res) => res.status(404).send('<h1>404</h1>'))

app.listen(3000, () => {
    console.log(`server listening on http://localhost:${PORT}`)
})