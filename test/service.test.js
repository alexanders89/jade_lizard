const request = require('supertest')
const app = require('../index')

describe('homepage', ()=>{
  it('welcomes the user with a nice message', ()=>{
    request(app).get('/')
    .expect(200)
    .expect(/welcome, please subscribe/)
  })
})
