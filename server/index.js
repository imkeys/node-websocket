var express = require('express')
var http = require('http')
var WebSocket = require('ws')
var app = express()
var server = http.createServer(app)
var wss = new WebSocket.Server({ server })

wss.on('connection', connection = (ws) => {
	console.log('连接成功')
	ws.on('message', incoming = (data) => {
		wss.clients.forEach(each = (client) => {
			client.send('do you love me?')
		})
	})
})

server.listen(10000, listening => {
	console.log('服务器启动成功')
})