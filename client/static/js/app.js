const socket = 'ws://localhost:10000'
const heart = {
	timeout: 1000 * 2,
	timeoutObj: null,
	serverTimeoutObj: null,
	reset () {
		clearTimeout(this.timeoutObj)
		clearTimeout(this.serverTimeoutObj)
		this.start()
	},
	start () {
		var self = this
		this.timeoutObj = setTimeout(() => {
			ws.send("boom")
			self.serverTimeoutObj = setTimeout(() => {
				ws.close()
			}, self.timeout)
		}, this.timeout)
	}
}

const createWebsocket = (url) => {
  try {
    console.log(url)
    ws = new WebSocket(url)
  } catch (e) {
    console.log(e)
  }
}

createWebsocket(socket)

// 连接成功
ws.onopen = (e) => {
  heart.start()
  console.log('与服务器的连接已打开')
  console.log(e)
}

// 接收信息
ws.onmessage = (e) => {
  heart.reset()
  console.log('接收服务器数据')
  console.log(e)
}

// 断开连接
ws.onclose = (e) => {
  createWebsocket()
  console.log('与服务器的连接已断开：')
  console.log(e)
}

// 发生错误
ws.onerror = (e) => {
  createWebsocket()
  console.log('发生错误')
  console.log(e)
}

// 发送信息
$('#send').bind({
  'click' () {
    const data = $('#message').val()
    ws.send(data)
  }
})
