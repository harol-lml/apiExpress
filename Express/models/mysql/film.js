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

  }

  static async delete({ id }){

  }

  static async update({input, id}){

  }
}