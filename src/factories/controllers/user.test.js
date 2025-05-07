import { makeGetUserByIdController } from './user.js'
import { GetUserByIdController } from '../../controllers/index.js'

describe('User Controller Factories', () => {
    it('should return a valid GetUserByIdController instance', () => {
        expect(makeGetUserByIdController()).toBeInstanceOf(
            GetUserByIdController,
        )
    })
})
