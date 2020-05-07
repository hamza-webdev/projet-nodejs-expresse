let http = require('http');

const server = http.createServer();

server.on('request', function(req, res){
    console.log('il ya une requtte');
})

server.listen(8080);