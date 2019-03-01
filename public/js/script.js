$(function(){

  let socket = io.connect('http://localhost:3000')

  socket.on('welcome', (data) => {
    $('#header').html(`User ID: ${data}`)
  })

  socket.on('subscribe', (data) => {
    $('#stocks').html(buildOutput(data))
  })

  socket.on('unsubscribe', (data) => {
    $('#stocks').html(buildOutput(data))
  })


  buildOutput = (data) =>{
    let output = ""
    data.forEach(function(stock){
      output+= `
      <div class='stock'>
      <div class='stockName'>${stock}</div>
      <div class='stockTicker'></div>
      <div class='stockPrice'></div>
      <div class='stockTime'></div>
      <div class='stockVolume'></div>
      </div>`
    })
    console.log(output)
    return output
  }

})
