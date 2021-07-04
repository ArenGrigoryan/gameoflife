'use strict'
console.clear()

const fs   = require('fs'),
	  PORT = (process.argv[2] ? process.argv[2] : 3000)
const contentTypes = require('./content-types.js')

const app = require('http').createServer((req, res) => {
	const requested = ((req.url == '/' || req.url == '/index') ? '/index.html' : req.url),
		  reqParts = requested.split('.'),
		  contentType = contentTypes[reqParts[reqParts.length-1]]

	if (contentType) res.writeHead(200, {'Content-Type': contentType})
	fs.readFile('public'+requested, (e,f) => {
		res.end(e&&e.code == 'ENOENT' ? 'Error 404: could not find '+req.url + (req.url == requested ? '' : ' ('+requested+')') : f)
	})

}).listen(PORT, process.stdout.write('Server is started at http://localhost'+(PORT == 80 ? '' : ':'+PORT)+'/\n'))

// const io = require('socket.io')(app)
// io.on('connection', (socket) => {
// 	console.log(socket)
// })