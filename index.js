const fs  = require('fs')
const app = require('http').createServer((req, res) => {
	try { res.end(fs.readFileSync('public'+((req.url == '/' || req.url == '/index') ? '/index.html' : req.url))) }
	catch (e) {
		if (req.url == '/favicon.ico') {}
		else {
			console.log(e)
			res.end('Error')
		}
	}
}).listen(3000, () => console.log('Started.'))