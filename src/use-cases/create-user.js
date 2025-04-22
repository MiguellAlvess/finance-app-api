import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import { PostgresCreateUserRepository } from '../repositories/postgres/create-user.js'
import { PostgresGetUserEmailRepository } from '../repositories/postgres/get-user-email.js'
import { EmailAlreadyInUseError } from '../errors/user.js'

export class CreateUserUseCase {
    async execute(createUserParams) {
        // verificar se o email ja esta em uso
        const getUserByEmailRepository = new PostgresGetUserEmailRepository()

        const userWithProvidedEmail = await getUserByEmailRepository.execute(
            createUserParams.email,
        )

        if (userWithProvidedEmail) {
            throw new EmailAlreadyInUseError(createUserParams.email)
        }

        // gerar ID do usuário
        const userId = uuidv4()

        // criptografar a senha
        const hashedPassword = await bcrypt.hash(createUserParams.password, 10)

        // inserir o usuario no banco de dados
        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        }

        // chamar o repositorio

        const postgresCreateUserRepository = new PostgresCreateUserRepository()

        const createdUser = await postgresCreateUserRepository.execute(user)

        return createdUser
    }
}
