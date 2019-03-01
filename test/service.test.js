const request = require('supertest')
const app = require('../index')

describe('homepage', ()=>{
  it('welcomes the user with a nice message', ()=>{
    request(app).get('/')
    .expect(200)
    .expect(/welcome, please subscribe/)
  })
})

describe('subscribe', function(){
  it('adds stock to the users subscriptions', function(done){
    request(app).post('/subscribe')
    .send({"id" : "test", "stocks" : ["Another One"]})
    .expect(200)
    .expect(["test", ['Test Stock 1', "Test Stock 2", "Another One"]], done)
  })
})

describe('unsubscribe', function(){
  it('removes stock from the users subscriptions', function(done){
    request(app).post('/unsubscribe')
    .send({"id" : "test", "stocks" : ["Test Stock 1"]})
    .expect(200)
    .expect(["test", ["Test Stock 2", "Another One"]], done)
  })
})
