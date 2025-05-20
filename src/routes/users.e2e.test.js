import supertest from 'supertest'
import { app } from '../app.js'
import { user } from '../tests/index.js'
import { faker } from '@faker-js/faker'

describe('User Routes E2E Tests', () => {
    const from = '2025-01-01'
    const to = '2025-01-31'
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

        const response = await supertest(app)
            .get(`/api/users`)
            .set('Authorization', `Bearer ${createdUser.tokens.acessToken}`)

        expect(response.status).toBe(200)
        expect(response.body.id).toBe(createdUser.id)
    })

    it('PATCH /api/users should return 200 when user is updated', async () => {
        const { body: createdUser } = await supertest(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const updateUserParams = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        }

        const response = await supertest(app)
            .patch(`/api/users`)
            .set('Authorization', `Bearer ${createdUser.tokens.acessToken}`)
            .send(updateUserParams)

        expect(response.status).toBe(200)
        expect(response.body.first_name).toBe(updateUserParams.first_name)
        expect(response.body.last_name).toBe(updateUserParams.last_name)
        expect(response.body.email).toBe(updateUserParams.email)
        expect(response.body.password).not.toBe(createdUser.password)
    })

    it('DELETE /api/users should return 200 when user is deleted', async () => {
        const { body: createdUser } = await supertest(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await supertest(app)
            .delete(`/api/users`)
            .set('Authorization', `Bearer ${createdUser.tokens.acessToken}`)

        expect(response.status).toBe(200)
        expect(response.body.id).toBe(createdUser.id)
    })

    it('GET /api/users/balance should return 200 and correct balance', async () => {
        const { body: createdUser } = await supertest(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        await supertest(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${createdUser.tokens.acessToken}`)
            .send({
                user_id: createdUser.id,
                name: faker.commerce.productName(),
                date: new Date(from),
                type: 'EARNING',
                amount: 10000,
            })

        await supertest(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${createdUser.tokens.acessToken}`)
            .send({
                user_id: createdUser.id,
                name: faker.commerce.productName(),
                date: new Date(from),
                type: 'EXPENSE',
                amount: 2000,
            })

        await supertest(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${createdUser.tokens.acessToken}`)
            .send({
                user_id: createdUser.id,
                name: faker.commerce.productName(),
                date: new Date(from),
                type: 'INVESTMENT',
                amount: 2000,
            })

        const response = await supertest(app)
            .get(`/api/users/balance?from=${from}&to=${to}`)
            .set('Authorization', `Bearer ${createdUser.tokens.acessToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            balance: '6000',
            earnings: '10000',
            expenses: '2000',
            investments: '2000',
        })
    })

    it('POST /api/users should return 400 when the provided emails is already in use', async () => {
        const { body: createdUser } = await supertest(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await supertest(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
                email: createdUser.email,
            })

        expect(response.status).toBe(400)
    })

    it('POST /api/users should return 400 when the provided password is invalid', async () => {
        const response = await supertest(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
                password: faker.internet.password({ length: 5 }),
            })

        expect(response.status).toBe(400)
    })

    it('POST /api/users should return 400 when the provided email is invalid', async () => {
        const response = await supertest(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
                email: 'invalid-email',
            })

        expect(response.status).toBe(400)
    })

    it('POST /api/users/login shhould return 200 and tokens when user crendentials are valid', async () => {
        const { body: createdUser } = await supertest(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await supertest(app).post('/api/users/login').send({
            email: createdUser.email,
            password: user.password,
        })

        expect(response.status).toBe(200)
        expect(response.body.tokens.acessToken).toBeDefined()
        expect(response.body.tokens.refreshToken).toBeDefined()
    })

    it('POST /api/users/refresh-token should return 200 and new tokens when refresh token is valid', async () => {
        const { body: createdUser } = await supertest(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await supertest(app)
            .post('/api/users/refresh-token')
            .send({
                refreshToken: createdUser.tokens.refreshToken,
            })

        expect(response.status).toBe(200)
        expect(response.body.acessToken).toBeDefined()
        expect(response.body.refreshToken).toBeDefined()
    })
})
