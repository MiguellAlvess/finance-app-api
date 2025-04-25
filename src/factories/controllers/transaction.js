import { CreateTransactionController } from '../../controllers/index.js'
import {
    PostgresCreateTransactionRepository,
    PostgresGetUserByIdRepository,
} from '../../repositories/postgres/index.js'
import { CreateTransactionUseCase } from '../../use-cases/index.js'

export const makeCreateTransactionController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const createTransactionRepository =
        new PostgresCreateTransactionRepository()

    const createTransactionUseCase = new CreateTransactionUseCase(
        createTransactionRepository,
        getUserByIdRepository,
    )

    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase,
    )

    return createTransactionController
}
