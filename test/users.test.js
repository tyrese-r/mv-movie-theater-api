// This file tests the user
const seed = require('../seed')
const request = require('supertest');
const app = require('../src/index.js');
const { User } = require('../models');




describe('Test \'users\' endpoints', () => {
    beforeEach(() => {
        return seed();
    });

    test('Test /hello to see if server is responding', async () => {
        const res = await request(app).get('/users/hello')
        expect(res.statusCode).toBe(200)
    })

    test('Get all users', async () => {
        const users = await User.findAll()
        const usersJSON = users.map(u => u.toJSON())
        const res = await request(app).get('/users/all')
        expect(res.statusCode).toBe(200)
        expect(JSON.stringify(res.body)).toMatch(JSON.stringify(usersJSON))
    })

    test('Get all users when there are no users in db', async () => {
        User.destroy({ where: {} })
        const res = await request(app).get('/users/all')
        expect(res.statusCode).toBe(204)
    })

    test('Get one user with id 1', async () => {
        const res = await request(app).get('/users/id/1')
        expect(res.statusCode).toBe(200)
    })

    test('Handle alpha id to get user', async () => {
        const res = await request(app).get('/users/id/g')
        expect(res.statusCode).toBe(400)
    })
    test('Handle ids out of range for user', async () => {
        const res = await request(app).get('/users/id/52378')
        expect(res.statusCode).toBe(404)
    })

    test('Get one user 1 shows', async () => {
        const res = await request(app).get('/users/id/1/shows')
        expect(res.statusCode).toBe(200)
    })

    test('Get one user 1 shows if empty', async () => {
        const user = await User.findByPk(1)
        const userShows = await user.getShows()
        await user.removeShows(userShows)
        const res = await request(app).get('/users/id/1/shows')
        expect(res.statusCode).toBe(204)
    })

    test('Handle out of range users shows', async () => {
        const res = await request(app).get('/users/id/1938/shows')
        expect(res.statusCode).toBe(404)
    })

    test('Handle invalid users shows', async () => {
        const res = await request(app).get('/users/id/foo/shows')
        expect(res.statusCode).toBe(400)
    })



})


