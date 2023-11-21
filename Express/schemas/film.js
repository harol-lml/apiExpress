const z = require('zod')

const filmSchema = z.object({
    title: z.string({
        invalid_type_error: 'Dilm title must be a string',
        required_error: 'Film title is required'
    }),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int(). positive(),
    rate: z.number().min(0).max(10).default(4),
    poster: z.string().url({
        message: 'Poster must be a valid URL'
    }),
    genre: z.array(
        z.enum(['Actrion', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
        {
            required_error: 'Film genre is reuire',
            invalid_type_error: 'Film genre must be an array of enum Genre'
        }
    )
})

function validateFilm(object){
    return filmSchema.safeParse(object)
}

function validateParcialFilm(object){
    return filmSchema.partial().safeParse(object)
}

module.exports= {validateFilm, validateParcialFilm}