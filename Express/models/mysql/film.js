import mysql from 'mysql2/promise'
import envPro from 'dotenv'

envPro.config() // to read env
let user = process.env.DB_USER // MSQL db user
let name = process.env.DB_NAME // MSQL db name
let pass = process.env.DB_PASS // MSQL db password

const conf = {
  host: 'localhost',
  user: user,
  port: 3306,
  password: pass,
  database: name
}

const connection = await mysql.createConnection(conf)

export class FilmModel {
  static async getAll ({ genre }) {
    let ge = genre ? ` INNER JOIN film_genre fg on fg.film_id = f.id
    INNER JOIN genres g on g.id  = fg.genre_id
    WHERE g.name ='${genre}';` : ''

    const [films, tableInf] = await connection.query(
      'SELECT BIN_TO_UUID(f.id) as id, title , `year` , director , duration , poster , rate FROM films f'+ge
    )

    for (const key in films) {
      const genre =  await this.getRelation({filmId: films[key].id});
      films[key] = {
        ...films[key],
        genre: genre
      }
    }
    return films
  }

  static async getById({ id }){

    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
    if(!regexExp.test(id)) return false

    const [films, tableInf] = await connection.query(
      `SELECT BIN_TO_UUID(f.id) as id, title , year , director , duration , poster , rate FROM films f WHERE BIN_TO_UUID(f.id) = '${id}'`
    )

    if(!films[0]) return films

    const genre =  await this.getRelation({filmId: films[0].id});
    films[0] = {
      ...films[0],
      genre: genre
    }
    return films
  }

  static async create({ input }){
    const [films, tableInf] = await connection.query(
      `INSERT INTO  films (id, title, year, director, duration, poster, rate) VALUES (UUID_TO_BIN(UUID()),"${input.title}",${input.year},"${input.director}",${input.duration}, "${input.poster}",${input.rate})`
    )
    return films
  }

  static async delete({ id }){
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
    if(!regexExp.test(id)) return false

    let ge = id ? ` DELETE FROM films f WHERE BIN_TO_UUID(f.id) = '${id}';` : ''
    let geRel = id ? ` DELETE FROM film_genre fg WHERE BIN_TO_UUID(fg.film_id) = '${id}';` : '' // Para eliminar la relacion pelicula <-> genero

    const [films, tableInf] = await connection.query(ge)
    const [genFilms, genTableInf] = await connection.query(geRel)

    return films
  }

  static async update({input, id}){

    let dataUpdate = ''
    if(input.title)     dataUpdate += ` title = "${input.title}",`
    if(input.year)      dataUpdate += ` year = ${input.year},`
    if(input.director)  dataUpdate += ` director = "${input.director}",`
    if(input.duration)  dataUpdate += ` duration = ${input.duration},`
    if(input.poster)    dataUpdate += ` poster = "${input.poster}",`
    if(input.rate)      dataUpdate += ` rate = ${input.rate},`
    dataUpdate = dataUpdate.slice(0, -1)

    if(input.genre){
      let geRel = id ? ` DELETE FROM film_genre fg WHERE BIN_TO_UUID(fg.film_id) = '${id}';` : '' // Para eliminar la relacion pelicula <-> genero
      let genRelation = ''
      const [genFilms, genTableInf] = await connection.query(geRel)

      for (const key in input.genre) {
        genRelation = `INSERT  INTO film_genre (film_id, genre_id) values
        ((SELECT id FROM films WHERE BIN_TO_UUID(id) = '${id}'), (SELECT id FROM genres WHERE name = "${input.genre[key]}"))`
        const [pachFilms, pathInf] = await connection.query(genRelation)
      }
    }

    const [films, tableInf] = await connection.query(`UPDATE films f set ${dataUpdate} WHERE BIN_TO_UUID(f.id) = '${id}';`)
    return films
  }

  static async getRelation({ filmId }){

    const [genrs, tableInf] = await connection.query(
      `SELECT g.name FROM genres g
      INNER JOIN film_genre fg ON fg.genre_id = g.id
      INNER JOIN films f ON f.id = fg.film_id
      WHERE BIN_TO_UUID(f.id) = '${filmId}'`
    )

    let g = genrs.map(({name}) => name)

    return g
  }
}