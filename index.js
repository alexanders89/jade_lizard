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

app.use(express.static('public'))
