import { MongoClient, ObjectId, ServerApiVersion} from 'mongodb'
import envPro from 'dotenv'

envPro.config() // to read env
let name = process.env.MG_NAME // Mongo db name
let pass = process.env.MG_PASS // MOngo db password
const uri = `mongodb+srv://${name}:${pass}@cluster0.e9tjso8.mongodb.net/?retryWrites=true&w=majority`

const client  = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  })

async function connect() {
    try {
        await client.connect()
        const database = client.db('films')
        return database.collection('films')
    }catch (error) {
        console.error('We have an error to connect mongodb')
        console.error(error)
        await client.close()
    }
}
export class FilmModel {
  static async getAll ({ genre }) {
    const db = await connect()
    if(genre){
        return db.find({
            genre:{
                $elemMatch: {
                  $regex: genre,
                  $options: 'i'
                }
            }
        }).toArray()
    }
    return db.find({}).toArray()
  }

  static async getById({ id }){
    const db = await connect()
    const objId = new ObjectId(id)

    return db.findOne({_id: objId})
  }

  static async create({ input }){
    const db = await connect()
    const { insertedId } = await db.insertOne(input)

    return {
      id: insertedId,
      ...input
    }
  }

  static async delete({ id }){
    const db = await connect()
    const objId = new ObjectId(id)
    const { deletedCount } = await db.deleteOne({_id: objId})

    return deletedCount > 0
  }

  static async update({input, id}){
    const db = await connect()
    const objId = new ObjectId(id)
    const value = await db.findOneAndUpdate({ _id: objId }, { $set: input }, { returnNewDocument: true })

    return value
  }
}