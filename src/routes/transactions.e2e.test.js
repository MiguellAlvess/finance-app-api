import supertest from 'supertest'
import { app } from '../app.cjs'
import { faker } from '@faker-js/faker'
import { transaction, user } from '../tests/index.js'

describe('Transactions Routes E2E Tests', () => {
    it('POST /api/transactions should return 201 when transaction is created', async () => {
        const { body: createdUser } = await supertest(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await supertest(app)
            .post('/api/transactions')
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

    it('GET /api/transactions?userId should return 200 when fatching transactions successfully', async () => {
        const { body: createdUser } = await supertest(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const { body: createdTransaction } = await supertest(app)
            .post('/api/transactions')
            .send({
                ...transaction,
                user_id: createdUser.id,
                id: undefined,
            })

        const response = await supertest(app).get(
            `/api/transactions?userId=${createdUser.id}`,
        )

        expect(response.status).toBe(200)
        expect(response.body[0].id).toEqual(createdTransaction.id)
    })

    it('PATCH /api/transactions/:transactionId should return 200 when transaction is updated', async () => {
        const { body: createdUser } = await supertest(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const { body: createdTransaction } = await supertest(app)
            .post('/api/transactions')
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
            .patch(`/api/transactions/${createdTransaction.id}`)
            .send(updateTransactionParams)

        expect(response.status).toBe(200)
        expect(response.body.amount).toBe('10000')
        expect(response.body.type).toBe('EARNING')
        expect(response.body.name).toBe(updateTransactionParams.name)
    })

    it('DELETE /api/transactions/:transactionId should return 200 when transaction is deleted', async () => {
        const { body: createdUser } = await supertest(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const { body: createdTransaction } = await supertest(app)
            .post('/api/transactions')
            .send({
                ...transaction,
                user_id: createdUser.id,
                id: undefined,
            })

        const response = await supertest(app).delete(
            `/api/transactions/${createdTransaction.id}`,
        )

        expect(response.status).toBe(200)
        expect(response.body.id).toBe(createdTransaction.id)
    })

    it('PATCH /api/transactions/:transactionId should return 404 when updating a non-existent transaction', async () => {
        const response = await supertest(app)
            .patch(`/api/transactions/${faker.string.uuid()}`)
            .send({
                type: 'EARNING',
                amount: 10000,
            })

        expect(response.status).toBe(404)
    })

    it('DELETE /api/transactions/:transactionId should return 404 when deleting a non-existent transaction', async () => {
        const response = await supertest(app)
            .delete(`/api/transactions/${faker.string.uuid()}`)
            .send({
                type: 'EARNING',
                amount: 10000,
            })

        expect(response.status).toBe(404)
    })

    it('GET /api/transactions?userId should return 404 when fetching transactions of a non-existent user', async () => {
        const response = await supertest(app).get(
            `/api/transactions?userId=${faker.string.uuid()}`,
        )

        expect(response.status).toBe(404)
    })
})
