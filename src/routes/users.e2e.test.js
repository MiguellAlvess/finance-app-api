import supertest from 'supertest'
import { app } from '../app.js'
import { user } from '../tests/index.js'

describe('User Routes E2E Tests', () => {
    it('POST /api/users should return 201 when user is created', async () => {
        const response = await supertest(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        expect(response.status).toBe(201)
    })

    it('GET /api/users should return 200 when user is found', async () => {
        const { body: createdUser } = await supertest(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await supertest(app).get(
            `/api/users/${createdUser.id}`,
        )

        expect(response.status).toBe(200)
        expect(response.body).toEqual(createdUser)
    })
})
