const express = require('express')
const dittoJson = require('./dito.json')
const app = express()

const PORT = process.env.PORT ?? 3000

app.disable('x-powered-by')

app.use((req, res, next) => {
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
})

app.get('/', (req, res) => {
    res.json({hola: 'Pagina'})
})

app.get('/dog', (req, res) => {
    res.send('https://http.cat/images/100.jpg')
})

app.post('/dogs', (req,res) => {
    console.log(req.body)

    res.status(201).json(req.body)
})

app.use((req, res) => res.status(404).send('<h1>404</h1>'))

app.listen(3000, () => {
    console.log(`server listening on http://localhost:${PORT}`)
})