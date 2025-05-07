import { makeCreateTransactionController } from './transaction.js'

import { CreateTransactionController } from '../../controllers/index.js'

describe('Transaction Controller Factories', () => {
    it('should return a valid CreateTransactionController instance', () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })
})
