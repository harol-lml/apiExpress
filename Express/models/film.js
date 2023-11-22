import { createRequire } from 'node:module'
import { randomUUID } from 'node:crypto'

const require = createRequire(import.meta.url)
const filmJson = require('../film.json')

export class FilmModel {
    static getAll = async ({ genre }) => {
        if(genre){
            return filmJson.filter(
                film => film.genre.some(g => g.toLowerCase() === genre.toLowerCase())
            )
        }
        return filmJson
    }

    static async getById ({ id }) {
        return filmJson.find(film => film.id == id)
    }

    static async create ({ input }) {

        const newFilm = {
            id: randomUUID(), // crea uuid en version 4
            ...input
        }
        filmJson.push(newFilm)

        return newFilm
    }

    static async delete ({ id }) {
        const filmIndex = filmJson.findIndex(f => f.id === id)

        if(filmIndex === -1) return false
        filmJson.splice(filmIndex, 1)
        return true
    }

    static async update ({ input, id }) {
        const filmIndex = filmJson.findIndex ( f => f.id === id)
        if (filmIndex === -1) return false

        filmJson[filmIndex] = {
            ...filmJson[filmIndex],
            ...input
        }
        return filmJson[filmIndex]
    }
}