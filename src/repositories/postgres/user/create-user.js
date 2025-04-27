import { prisma } from '../../../../prisma/prisma.js'

export class PostgresCreateUserRepository {
    async execute(createUsersParams) {
        const user = await prisma.user.create({
            data: {
                id: createUsersParams.id,
                first_name: createUsersParams.first_name,
                last_name: createUsersParams.last_name,
                email: createUsersParams.email,
                password: createUsersParams.password,
            },
        })

        return user
    }
}
