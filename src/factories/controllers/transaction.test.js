import {
    makeCreateTransactionController,
    makeUpdateTransactionController,
    makeDeleteTransactionController,
} from './transaction.js'

import {
    CreateTransactionController,
    UpdateTransactionController,
    DeleteTransactionController,
} from '../../controllers/index.js'

describe('Transaction Controller Factories', () => {
    it('should return a valid CreateTransactionController instance', () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })

    it('should return a valid UpdateTransactionController instance', () => {
        expect(makeUpdateTransactionController()).toBeInstanceOf(
            UpdateTransactionController,
        )
    })
    it('should return a valid DeleteTransactionController instance', () => {
        expect(makeDeleteTransactionController()).toBeInstanceOf(
            DeleteTransactionController,
        )
    })
})
