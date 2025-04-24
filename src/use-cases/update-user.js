import bcrypt from 'bcrypt'
import {
    PostgresGetUserEmailRepository,
    PostgresUpdateUserRepository,
} from '../repositories/postgres/index.js'
import { EmailAlreadyInUseError } from '../errors/user.js'

export class UpdateUserUseCase {
    async execute(userId, updateUserParams) {
        // se o email tiver sendo atualizado, verifica-lo se ja esta em uso

        if (updateUserParams.email) {
            const getUserByEmailRepository =
                new PostgresGetUserEmailRepository()

            const userWithProvidedEmail =
                await getUserByEmailRepository.execute(updateUserParams.email)

            if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
                throw new EmailAlreadyInUseError(updateUserParams.email)
            }
        }

        const user = {
            ...updateUserParams,
        }

        if (updateUserParams.password) {
            const hashedPassword = await bcrypt.hash(
                updateUserParams.password,
                10,
            )

            user.password = hashedPassword
        }

        const updateUserRepository = new PostgresUpdateUserRepository()
        const updateUser = await updateUserRepository.execute(userId, user)

        return updateUser
    }
}
