import supertest from 'supertest'
import { app } from '../..'
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
})
