const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html')
})

// 服务
io.on('connection', connection = (ws) => {
	// 连接
	console.log('连接成功['+ new Date()+ ']')
	// 加入
	ws.on('login', (data) => {
		console.log(data.userName + '已登录')
		// 向所有客户端广播用户加入
		io.emit('login', data)
	})
	// 退出
	ws.on('logout', (data) => {
		// 向所有客户端广播用户退出
		io.emit('logout', data)
	})
	// 消息
	ws.on('message', (data) => {
		// 向所有客户端广播发布的消息
		// io.to(ws.id).emit('message', data)
		io.emit('message', data)
	})
})

// 创建服务
server.listen(10000, () => {
	console.log('服务器启动成功 ws://localhost:10000')
})
