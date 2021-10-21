const request = require('supertest');
const app = require('../index');
const expect = require('chai').expect;

const mockedCalls = [
    {
        first_name: "bruce",
        last_name: "wayne",
        sip: "is a hacker",
        city: "gotham",
        state: "ny",
        phone_number: "123-123-1234",
        priority: 101,
        timestamp: "2021-10-21T16:01:04+0000"
      },
      {
        first_name: "clark",
        last_name: "kent",
        sip: "is suppy",
        city: "metropolis",
        state: "ma",
        phone_number: "456-123-9876",
        priority: 99,
        timestamp: "2021-10-21T16:01:04+0000"
      },
]

describe('API testing', () => {
    it('Should return null when theres nothing enqueued', (done) => {
        request(app)
        .get('/')
        .expect(200)
        .end((err, res) => {
            expect(res.body).to.eql({})
            done()
        })
    })

    it('Should return the highest priority object', (done) => {
        request(app)
        .post('/test')
        .set('Content-type', 'application/json')
        .send(mockedCalls[0])
        .expect(200)

        request(app)
        .get('/')
        .expect(200)
        .end((err, res) => {
            console.log(res.body)
            console.log(`>> here`)
            expect(res.body).to.eql({})
            done()
        })
    })

})