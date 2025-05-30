import supertest from 'supertest'
import { app } from '../app.js'
import { faker } from '@faker-js/faker'
import { transaction, user } from '../tests/index.js'

describe('Transactions Routes E2E Tests', () => {
    const from = '2025-05-19'
    const to = '2025-05-30'
    it('POST /api/transactions/me should return 201 when transaction is created', async () => {
        const { body: createdUser } = await supertest(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await supertest(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${createdUser.tokens.acessToken}`)
            .send({
                ...transaction,
                user_id: createdUser.id,
                id: undefined,
            })

        expect(response.status).toBe(201)
        expect(response.body.user_id).toBe(createdUser.id)
        expect(response.body.name).toBe(transaction.name)
        expect(response.body.type).toBe(transaction.type)
        expect(response.body.amount).toBe(String(transaction.amount))
    })

    it('GET /api/transactions/me should return 200 when fatching transactions successfully', async () => {
        const { body: createdUser } = await supertest(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const { body: createdTransaction } = await supertest(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${createdUser.tokens.acessToken}`)
            .send({
                ...transaction,
                date: new Date(from),
                user_id: createdUser.id,
                id: undefined,
            })

        const response = await supertest(app)
            .get(`/api/transactions/me?from=${from}&to=${to}`)
            .set('Authorization', `Bearer ${createdUser.tokens.acessToken}`)

        expect(response.status).toBe(200)
        expect(response.body[0].id).toEqual(createdTransaction.id)
    })

    it('PATCH /api/transactions/me/:transactionId should return 200 when transaction is updated', async () => {
        const { body: createdUser } = await supertest(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const { body: createdTransaction } = await supertest(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${createdUser.tokens.acessToken}`)
            .send({
                ...transaction,
                user_id: createdUser.id,
                id: undefined,
            })

        const updateTransactionParams = {
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            type: 'EARNING',
            amount: 10000,
        }

        const response = await supertest(app)
            .patch(`/api/transactions/me/${createdTransaction.id}`)
            .set('Authorization', `Bearer ${createdUser.tokens.acessToken}`)
            .send(updateTransactionParams)

        expect(response.status).toBe(200)
        expect(response.body.amount).toBe('10000')
        expect(response.body.type).toBe('EARNING')
        expect(response.body.name).toBe(updateTransactionParams.name)
    })

    it('DELETE /api/transactions/me/:transactionId should return 200 when transaction is deleted', async () => {
        const { body: createdUser } = await supertest(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const { body: createdTransaction } = await supertest(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${createdUser.tokens.acessToken}`)
            .send({
                ...transaction,
                user_id: createdUser.id,
                id: undefined,
            })

        const response = await supertest(app)
            .delete(`/api/transactions/me/${createdTransaction.id}`)
            .set('Authorization', `Bearer ${createdUser.tokens.acessToken}`)

        expect(response.status).toBe(200)
        expect(response.body.id).toBe(createdTransaction.id)
    })

    it('DELETE /api/transactions/me/:transactionId should return 404 when deleting a non-existent transaction', async () => {
        const { body: createdUser } = await supertest(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await supertest(app)
            .delete(`/api/transactions/me/${faker.string.uuid()}`)
            .set('Authorization', `Bearer ${createdUser.tokens.acessToken}`)
            .send({
                type: 'EARNING',
                amount: 10000,
            })

        expect(response.status).toBe(404)
    })
})
