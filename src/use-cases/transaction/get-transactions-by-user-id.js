import { userNotFoundResponse } from '../../controllers/helpers/user.js'
export class GetTransactionsByUserIdUseCase {
    constructor(getTransactionsByUserIdRepository, getUserByIdRepository) {
        this.getTransactionsByUserIdRepository =
            getTransactionsByUserIdRepository
        this.getUserByIdRepository = getUserByIdRepository
    }

    async execute(params) {
        // validar se o usuario existe
        const user = await this.getUserByIdRepository.execute(params.user_id)

        if (!user) {
            return userNotFoundResponse()
        }
        // chamar repository
        const transactions = this.getTransactionsByUserIdRepository.execute(
            params.user_id,
        )

        return transactions
    }
}
