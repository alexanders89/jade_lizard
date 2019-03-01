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
})

//Holding data on the users and what they have subscribed to
let users = []
let currentSubscriptions = []

//middleware
app.use(express.static('public'))
app.use(bodyParser.json())


//Routes
app.post('/subscribe', (req, res) =>{
  subscribeUser(req.body)
  res.status(200).send("Hello You!")
})

app.post('/unsubscribe', (req, res) => {
  unsubscribeUser(req.body)
  res.status(200).send("Hello You!")
})

//Functions
subscribeUser = (data) => {
  for(let i = 0; i < users.length; i++){
    if(users[i].id == data.id){
      data.stocks.forEach(function(stock){
        if(!users[i].stocks.includes(stock)){
          users[i].stocks.push(stock)
        }
      })
      let mySocket = users[i].socketInfo
      mySocket.emit('subscribe', data.stocks)
      break
    }
  }
}

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
      })
      let mySocket = users[i].socketInfo
      mySocket.emit('unsubscribe', users[i].stocks)
      break
    }
  }
  console.log(users)
}

addUser = (data) => {
  let user = new Object()
  user.id = data.id
  user.stocks = []
  users.push(user)
  user.socketInfo = data
  console.log(users)
}

removeUser = (data) => {
  for(let i = 0; i < users.length; i++){
    if(users[i].id == data.id){
      users.splice(i, 1)
      break
    }
  }
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
