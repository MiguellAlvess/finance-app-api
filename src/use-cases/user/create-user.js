import { EmailAlreadyInUseError } from '../../errors/user.js'

export class CreateUserUseCase {
    constructor(
        getUserByEmailRepository,
        createUserRepository,
        passwordHasherAdapter,
        generatorIdAdapter,
        tokensGeneratorAdapter,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.createUserRepository = createUserRepository
        this.passwordHasherAdapter = passwordHasherAdapter
        this.generatorIdAdapter = generatorIdAdapter
        this.tokensGeneratorAdapter = tokensGeneratorAdapter
    }
    async execute(createUserParams) {
        const userWithProvidedEmail =
            await this.getUserByEmailRepository.execute(createUserParams.email)

        if (userWithProvidedEmail) {
            throw new EmailAlreadyInUseError(createUserParams.email)
        }

        const userId = this.generatorIdAdapter.execute()

        const hashedPassword = await this.passwordHasherAdapter.execute(
            createUserParams.password,
        )

        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        }

        const createdUser = await this.createUserRepository.execute(user)

        return {
            ...createdUser,
            tokens: this.tokensGeneratorAdapter.execute(userId),
        }
    }
}
