const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const json = require('json')
const fetch = require('node-fetch')

let port = 5000

io.on('connection', socket => {
	console.log('User connected')
	socket.on('disconnect', () => {
		console.log('User disconnected')
	})

	setInterval(() => {
		fetch('http://api.open-notify.org/iss-now.json')
			.then(data => {
				return data.text()
			})
			.then(data => {
				return JSON.parse(data)
			})
			.then(myJson => {
				socket.emit('coords', {
					long: Number(myJson.iss_position.longitude).toFixed(2),
					lat: Number(myJson.iss_position.latitude).toFixed(2),
				})
			})
	}, 5000)
})

http.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})
