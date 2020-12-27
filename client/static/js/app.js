(function () {
  chat = {
    socketUrl: 'ws://192.168.1.153:10000/',
    input: $('#message'),
    lister: $('#lister'),
    userName: null,
    userId: null,
    userAvatar: null,
    socket: null,
    genUid () {
      const soup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      const soupLength = soup.length
      const length = 8
      let id = []
      for (let i = 0; i < length; i++) {
        id[i] = soup.charAt(Math.random() * soupLength)
      }
      return id.join('')
    },
    getUid () {
      return new Date().getTime() + '' + Math.floor(Math.random() * 899 + 100)
    },
    getName () {
      const list = [
        '子璇', '瑾春', '文昊', '熙涵', '溶溶', '冰枫', '欣欣', '宜豪', '欣慧', '建政', '美欣', '淑慧', '文轩', '文杰', '欣源', '榕润', '欣汝', '慧嘉', '亦菲', '冰洁', '佳欣', '涵涵', '禹辰', '淳美', '泽惠', '伟洋', '涵越', '润丽', '淑华', '晶莹', '凌晶', '苒溪', '雨涵', '嘉怡', '佳毅', '子辰', '佳琪', '紫轩', '瑞辰', '昕蕊', '欣宜', '泽远', '欣怡', '佳怡', '佳惠', '晨茜', '晨璐', '运昊', '汝鑫', '淑君', '晶滢', '润莎', '榕汕', '佳钰', '佳玉', '晓庆', '语晨', '雨泽', '雅晗', '雅涵', '清妍', '诗悦', '嘉乐', '晨涵', '天赫', '玥傲', '佳昊', '萌萌', '若萌'
      ]
      const random = Math.floor(Math.random() * list.length)
      return list[random]
    },
    getAvatar () {
      const list = [
        './static/image/avatar-00.jpg',
        './static/image/avatar-01.jpg',
        './static/image/avatar-02.jpg',
        './static/image/avatar-03.jpg',
        './static/image/avatar-04.jpg',
        './static/image/avatar-05.jpg',
        './static/image/avatar-06.jpg'
      ]
      const random = Math.floor(Math.random() * list.length)
      return list[random]
    },
    login () {
      if (window.localStorage && window.localStorage.getItem('user')) {
        const { uid, name, avatar } = JSON.parse(window.localStorage.getItem('user'))
        this.userId = uid
        this.userName = name
        this.userAvatar = avatar
      } else {
        this.userId = this.genUid()
        this.userName = this.getName()
        this.userAvatar = this.getAvatar()
        const user = {
          uid: this.userId,
          name: this.userName,
          avatar: this.userAvatar
        }
        window.localStorage.setItem('user', JSON.stringify(user))
      }

      this.socket.emit('login', {
        userId: this.userId,
        userName: this.userName,
        userAvatar: this.userAvatar
      })

      $('#userAvatar').html('<img src="'+ this.userAvatar +'">')
      $('#userName').html(this.userName)
    },
    logout () {
      this.socket.emit('logout', {})
    },
    submit () {
      const msg = $.trim(this.input.val())
      if (msg) {
        chat.socket.emit('message', {
          avatar: this.userAvatar,
          uid: this.userId,
          name: this.userName,
          stamp: new Date().getTime(),
          content: {
            type: 'txt',
            data: msg
          }
        })
        this.input.val('')
      }
    },
    init () {
      // 建立连接
      this.socket = io.connect(this.socketUrl, {
        transports: ['websocket']
      })
      // 创建角色
      this.login()
      // 监听登录
      this.socket.on('login', (data) => {
      })
      // 监听退出
      this.socket.on('logout', (data) => {
      })
      // 监听消息
      this.socket.on('message', (data) => {
        let html = ''
        let content = ''
        let type = 'other'

        if (data.uid === this.userId) {
          type = 'me'
        }

        if (data.content.type === 'txt') {
          content += '<div class="txt">'
          content += '<p>'+ data.content.data +'</p>'
          content += '</div>'
        }

        html += '<dd class="item '+ type +'">'
        html += '<div class="inf">'
        html += '<div class="avatar">'
        html += '<img src="'+ data.avatar +'" />'
        html += '</div>'
        html += '<div class="name">'
        html += '<span>'+ data.name +'</span>'
        html += '<span>'+ parseTime(data.stamp, '{y}-{m}-{d} {h}:{i}:{s}') +'</span>'
        html += '</div>'
        html += '<div class="text">'
        html += content
        html += '</div>'
        html += '</div>'
        html += '</dd>'
        this.lister.find('.list').append(html)
        this.lister.scrollTop(this.lister.find('.list').height())
      })
    }
  }

  chat.init()
  
  /**
   * 点击按钮发送消息
   */
  $('#send').bind({
    'click' () {
      chat.submit()
    }
  })

  /**
   * 回车发送消息
   */
  $('#message').bind({
    'keyup' (e) {
      e = e || event
      if (e.keyCode === 13) {
        chat.submit()
      }
    }
  })
})()
