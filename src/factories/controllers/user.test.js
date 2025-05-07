import { makeCreateUserController, makeGetUserByIdController } from './user.js'
import {
    CreateUserController,
    GetUserByIdController,
} from '../../controllers/index.js'

describe('User Controller Factories', () => {
    it('should return a valid GetUserByIdController instance', () => {
        expect(makeGetUserByIdController()).toBeInstanceOf(
            GetUserByIdController,
        )
    })

    it('should return a valid CreateUserByIdController instance', () => {
        expect(makeCreateUserController()).toBeInstanceOf(CreateUserController)
    })
})
