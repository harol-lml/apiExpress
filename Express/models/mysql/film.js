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

    return films
  }

  static async getById({ id }){
    id = id ? id : ''
    const [films, tableInf] = await connection.query(
      `SELECT BIN_TO_UUID(f.id) as id, title , year , director , duration , poster , rate FROM films f WHERE BIN_TO_UUID(f.id) = '${id}'`
    )
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

    const [films, tableInf] = await connection.query(ge)

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

    const [films, tableInf] = await connection.query(`UPDATE films f set ${dataUpdate} WHERE BIN_TO_UUID(f.id) = '${id}';`)
    return films
  }
}