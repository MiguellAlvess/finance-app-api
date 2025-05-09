import supertest from 'supertest'
import { app } from '../app.js'
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
})
