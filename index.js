require('dotenv').load()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const socket = require('socket.io')
const port = process.env.PORT

const stockData = require('./tickData.json')

const server = app.listen(port, () =>{
  console.log("All is OK")
})

let users = []

app.use(express.static('public'))

let io = socket(server)

addUser = (data) => {
  let user = new Object()
  user.id = data.id
  user.stocks = []
  users.push(user)
  console.log(users)
}

removeUser = (data) => {
  for(let i = 0; i < users.length; i++){
    if(users[i].id == data.id){
      users.splice(i, 1)
      break
    }
  }
  console.log(users)
}

io.on('connection', (socket) => {
  addUser(socket)
  socket.on('disconnect', ()=>{
    removeUser(socket)
  })
})
module.exports = server
