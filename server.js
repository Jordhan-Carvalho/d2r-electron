const http = require('http');
const game = require('./game/game.js')

const startServer = () => {
  const hostname = '127.0.0.1';
  const port = 29301;

  const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'}); // http header
    const url = req.url;
    const method = req.method

    if (url === '/' && method === 'POST') {
      const body = []
      req.on('data', chunk => {
        body.push(chunk)
      });

      req.on('end', () => {
        const jsonRespString = body.join()
        try {
          const gameEvent = JSON.parse(jsonRespString)
          
          game.onNewGameEvent(gameEvent) 
        } catch (error) {
          //TODO: log and send error
          console.error("Error parsing game event", error)
        }
      })

      res.write("Success")
      res.end()
    } else {
      res.write("Not supported")
      res.end()
    }
  });

  server.listen(port, hostname, () => {
    console.log(`Listening on http://${hostname}:${port}/`);
  });
}

module.exports = {
  startServer
}
