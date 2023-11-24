import express, { json } from 'express'
import { filmRouter } from './reutes/films.js'
import { corsMiddleware } from './middlewares/cors.js'
// import filmJson from './film.json' with { type: 'json'}

const app = express()

const PORT = process.env.PORT ?? 3000

app.disable('x-powered-by')
app.use(corsMiddleware());
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

app.use('/film', filmRouter)

/* app.options('film/:id', (req, res) =>{
    res.header('Access-Control-Allow-Origin','http://localhost:5500')
    res.header('Access-Control-Allow-Methods','DELETE, GET, POST, PUT, PATCH')
    res.send(200)
}) */

app.use((req, res) => res.status(404).send('<h1>404</h1>'))

app.listen(3000, () => {
    console.log(`server listening on http://localhost:${PORT}`)
})