require('dotenv').load()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const socket = require('socket.io')
const port = process.env.PORT || 8080

const stockData = require('./tickData.json')

const server = app.listen(port, () =>{
  console.log(`All is OK on port: ${port}`)
  pushTrigger()
})

//Holding data on the users and what they have subscribed to. Mocked user for test
let users = [
  // { id: 'test',
  //   stocks: ["Test Stock 1", "Test Stock 2"]}
]
let currentSubscriptions = []
let pushInterval

//middleware
app.use(express.static('public'))
app.use(bodyParser.json())


//Routes
app.post('/subscribe', (req, res) =>{
  subscribeUser(req.body)
  res.status(200).send(getUser(req.body))
})

app.post('/unsubscribe', (req, res) => {
  unsubscribeUser(req.body)
  res.status(200).send(getUser(req.body))
})

//Functions

getUser = (data) => {
  for(var i = 0; i < users.length; i++) {
    if(users[i].id == data.id) {
      return [users[i].id, users[i].stocks]
    }
  }
}

subscribeUser = (data) => {
  for(let i = 0; i < users.length; i++){
    if(users[i].id == data.id){
      data.stocks.forEach(function(stock){
        if(!users[i].stocks.includes(stock)){
          users[i].stocks.push(stock)
        }
        if(!currentSubscriptions.includes(stock)){
          currentSubscriptions.push(stock)
        }
      })
      let mySocket = users[i].socketInfo
      mySocket.emit('subscribe', data.stocks)
      break
    }
  }
  console.log(currentSubscriptions)
}

//This needs work, currently it removes all stocks even if someone else is subscribed
unsubscribeUser = (data) => {
  for(let i = 0; i < users.length; i++){
    if(users[i].id == data.id){
      data.stocks.forEach(function(stock){
        if(users[i].stocks.includes(stock)){
          let index = users[i].stocks.indexOf(stock)
          if(index > -1){
            users[i].stocks.splice(index, 1)
          }
        }
        if(currentSubscriptions.includes(stock)){
          var index = currentSubscriptions.indexOf(stock)
          if(index > -1){
            currentSubscriptions.splice(index, 1)
          }
        }
      })
      let mySocket = users[i].socketInfo
      mySocket.emit('unsubscribe', users[i].stocks)
      break
    }
  }
  console.log(currentSubscriptions)
}

addUser = (data) => {
  let user = new Object()
  user.id = data.id
  user.stocks = []
  users.push(user)
  user.socketInfo = data
  // console.log(users)
}

removeUser = (data) => {
  for(let i = 0; i < users.length; i++){
    if(users[i].id == data.id){
      users.splice(i, 1)
      break
    }
  }
}

pushTrigger = () => {
  pushInterval = setInterval(pushFunction, 1000)
}

//Id like this to only fire when there are users with subscribers

pushFunction = () => {
  users.forEach(function(user){
    if(user.stocks.length > 0){
      let socket = user.socketInfo
      socket.emit("update", user.stocks)
    } else {
      // clearInterval(pushInterval)
    }
  })
}

//Socket Connections
let io = socket(server)

io.on('connection', (socket) => {
  addUser(socket)
  socket.emit('welcome', socket.id)
  socket.on('disconnect', ()=>{
    removeUser(socket)
  })
})

module.exports = server
