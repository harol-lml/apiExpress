const http =  require('node:http')
const fs =  require('node:fs')
const {findPort} = require('./freeport')
const {getHome, getContact, getImg, notFound} = require('./request')

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    if (req.url === '/'){
        let {statusCode, repEnd} = getHome();
        res.statusCode = statusCode;
        res.end(repEnd);
    } else if (req.url === '/img.jpg'){

        fs.readFile('/home/hapr/Descargas/IMG_1913.jpg', (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end('500 Internal Server Error.');
            } else {
                res.setHeader('Content-Type', 'image/jpeg');
                res.statusCode = 200;
                res.end(data);
            }
        })
    } else if (req.url === '/contact'){
        let {statusCode, repEnd} = getContact();
        res.statusCode = statusCode;
        res.end(repEnd);
    } else {
        let {statusCode, repEnd} = notFound();
        res.statusCode = statusCode;
        res.end(repEnd);
    }
})

findPort(3000).then(port => {
    server.listen(port, () => {
        console.log(`server listening on http://localhost:${port}`);
    })
})