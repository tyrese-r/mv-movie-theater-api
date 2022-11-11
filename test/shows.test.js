// This file tests the user
const seed = require('../seed')
const request = require('supertest');
const app = require('../src/index.js');
const { Show } = require('../models');



describe('Simple test GET \'shows\' endpoints', () => {
    beforeEach(seed)

    // GET
    test('Get all shows', async () => {
        const res = await request(app).get('/shows/')
        expect(res.statusCode).toBe(200)
    })
    test('Get one show by id', async () => {
        const res = await request(app).get('/shows/id/1')
        expect(res.statusCode).toBe(200)
    })
    test('Handle get show by invalid id', async () => {
        const res = await request(app).get('/shows/id/hello-invalid-id')
        expect(res.statusCode).toBe(404)
    })
    test('Handle non int for get show', async () => {
        const res = await request(app).get('/shows/id/3.14')
        expect(res.statusCode).toBe(404)
    })
    test('Handle get show by id out of range', async () => {
        const res = await request(app).get('/shows/id/314159')
        expect(res.statusCode).toBe(404)
    })
    test('Get show for specific genre: drama', async () => {
        const res = await request(app).get('/shows/genre/Drama')
        expect(res.statusCode).toBe(200)
    })
    test('Get show for specific genre: romance', async () => {
        const res = await request(app).get('/shows/genre/Romance')
        expect(res.statusCode).toBe(200)
    })
    test('Handle Get show for specific invalid genre: romance-drama', async () => {
        const res = await request(app).get('/shows/genre/Romance-Drama')
        expect(res.statusCode).toBe(404)
    })
    test('Delete show by id of 1', async () => {
        const res = await request(app).delete('/shows/id/1')
        expect(res.statusCode).toBe(200)
    })

    test('Handle deleting show twice by id of 1', async () => {
        const res = await request(app).delete('/shows/id/1')
        expect(res.statusCode).toBe(200)
        const res2 = await request(app).delete('/shows/id/1')
        expect(res2.statusCode).toBe(404)
    })
    
    test('Handle delete show by invalid id of 19900', async () => {
        const res = await request(app).delete('/shows/id/19900')
        expect(res.statusCode).toBe(404)
    })
    test('Typo in path /shows', async () => {
        const res = await request(app).delete('/showss/')
        expect(res.statusCode).toBe(404)
    })

    
    


})

describe('PUT \'shows\' endpoints', () => {
    beforeEach(seed)
    test('Update rating of show with id 1 to rating 90', async () => {
        const body = {
            rating: 90
        }
        const res = await request(app).put('/shows/id/1').send(body)
        expect(res.statusCode).toBe(200)
        
        // Get from db
        const show = Show.findByPk(1).toJSON()
        expect(res.body).toMatch(show)
    })

    test('Update status of show with id 1 to status in-production', async () => {
        const body = {
            status: 'in-production'
        }
        const res = await request(app).put('/shows/id/1').send(body)
        expect(res.statusCode).toBe(200)
        
        // Get from db
        const show = Show.findByPk(1).toJSON()
        expect(res.body.status).toBe('in-production')
        expect(res.body).toMatch(show)
    })

    test('Update status of show with id 1 to status cancelled', async () => {
        const body = {
            status: 'cancelled'
        }
        const res = await request(app).put('/shows/id/1').send(body)
        expect(res.statusCode).toBe(200)
        
        // Get from db
        const show = Show.findByPk(1).toJSON()
        expect(res.body.status).toBe('cancelled')
        expect(res.body).toMatch(show)
    })

    test('Update status and rating of show', async () => {
        const body = {
            status: 'cancelled',
            rating: 15
        }
        const res = await request(app).put('/shows/id/1').send(body)
        expect(res.statusCode).toBe(200)
        
        // Get from db
        const show = Show.findByPk(1).toJSON()
        expect(res.body.status).toBe('cancelled')
        expect(res.body.rating).toBe(15)
        expect(res.body).toMatch(show)
    })

    test('Handle incorrect data type for updating status', async () => {
        const body = {
            status: 54,
        }
        const res = await request(app).put('/shows/id/1').send(body)
        expect(res.statusCode).toBe(400)
    })
    test('Handle incorrect data type for updating rating', async () => {
        const body = {
            rating: 'fifteen'
        }
        const res = await request(app).put('/shows/id/1').send(body)
        expect(res.statusCode).toBe(400)
    })

    test('Handle incorrect empty body for updating show', async () => {
        const body = {
        }
        const res = await request(app).put('/shows/id/1').send(body)
        expect(res.statusCode).toBe(400)
    })
    test('Handle updating show when status is too short', async () => {
        const body = {
            status: 'test'
        }
        const res = await request(app).put('/shows/id/1').send(body)
        expect(res.statusCode).toBe(400)
    })
    test('Handle updating show when status is too long', async () => {
        const body = {
            status: 'this-status-is-more-than-25-characters'
        }
        const res = await request(app).put('/shows/id/1').send(body)
        expect(res.statusCode).toBe(400)
    })
    test('Reject negative numbers when updating show rating', async () => {
        const body = {
            rating: -100
        }
        const res = await request(app).put('/shows/id/1').send(body)
        expect(res.statusCode).toBe(400)
    })
    test('Reject non-integers when updating show rating', async () => {
        const body = {
            rating: 10.5
        }
        const res = await request(app).put('/shows/id/1').send(body)
        expect(res.statusCode).toBe(400)
    })
    test('Reject numbers greater than 100 when updating show rating', async () => {
        const body = {
            rating: 105
        }
        const res = await request(app).put('/shows/id/1').send(body)
        expect(res.statusCode).toBe(400)
    })
    test('Handle invalid keys when updating show', async () => {
        const body = {
            hello: 'world'
        }
        const res = await request(app).put('/shows/id/1').send(body)
        expect(res.statusCode).toBe(400)
    })
    test('Handle updating keys not allowed', async () => {
        const body = {
            title: 'Modern Family'
        }
        const res = await request(app).put('/shows/id/1').send(body)
        expect(res.statusCode).toBe(400)
    })
    test('Handle updating status and rating but status is invalid', async () => {
        const body = {
            status: 10.9,
            rating: 50
        }
        const res = await request(app).put('/shows/id/1').send(body)
        expect(res.statusCode).toBe(400)
    })
    test('Accept ints with decimals', async () => {
        const body = {
            rating: 10.0
        }
        const res = await request(app).put('/shows/id/1').send(body)
        expect(res.statusCode).toBe(400)

        // Get from db
        const show = Show.findByPk(1).toJSON()
        expect(res.body.rating).toBe(10)
        expect(res.body).toMatch(show)
    })
})

describe('DELETE \'shows\' endpoints', () => {
    beforeEach(seed)
    test('Successfully delete a show by id', async () => {
        const res = await request(app).delete('/shows/id/1')
        expect(res.statusCode).toBe(200)
    })
    test('Handle deleting invalid show', async () => {
        const res = await request(app).delete('/shows/id/109')
        expect(res.statusCode).toBe(404)
    })
    test('Handle deleting show twice', async () => {
        const res = await request(app).delete('/shows/id/1')
        expect(res.statusCode).toBe(200)
        const res2 = await request(app).delete('/shows/id/1')
        expect(res2.statusCode).toBe(404)
    })
})