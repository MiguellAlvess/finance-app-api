import { CreateUserController } from '../../controllers/index.js'
import {
    PostgresCreateTransactionRepository,
    PostgresGetUserByIdRepository,
} from '../../repositories/postgres/index.js'
import { CreateUserUseCase } from '../../use-cases/index.js'

export const makeCreateTransactionController = () => {
    const getUserByEmail = PostgresGetUserByIdRepository()

    const createTransactionRepository =
        new PostgresCreateTransactionRepository()

    const createTransactionUseCase = new CreateUserUseCase(
        getUserByEmail,
        createTransactionRepository,
    )

    const createTransactionController = new CreateUserController(
        createTransactionUseCase,
    )

    return createTransactionController
}
