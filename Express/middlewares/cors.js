import cors from 'cors'

const ACCEPT_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:5500'
]

export const corsMiddleware = ({acceptedOrigins = ACCEPT_ORIGINS} = {}) => cors({
    origin: (origin, callback) => {

        if(acceptedOrigins.includes(origin)) return callback(null, ture)

        if(!origin) return callback(null, true)

        return callback(new Error ('Not allowed by cors'))
    }
})