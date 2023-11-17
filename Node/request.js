const fs =  require('node:fs')

function getHome() {
    return {
        statusCode: 200,
        repEnd: 'Bienvenido a mi página de inicio'
    }
}

function getContact(){
    return {
        statusCode: 200,
        repEnd: 'Bienvenido a mi página de contacto'
    }
}

function getImg(){

    fs.readFile('/home/hapr/Descargas/IMG_1913.jpg', (err, data) => {
        console.log('hola');

        if (err) {
            return {
                statusCode: 500,
                repEnd: '500 Internal Server Error.'
            }
        } else {

            return {
                statusCode: 200,
                repEnd: data,
                content: 'image/jpg'
            }
        }
    })
}

function notFound(){
    return {
        statusCode: 404,
        repEnd: 'Recurso no encontrado'
    }
}

module.exports = {getHome, getContact, getImg, notFound}