import { prisma } from '../../../../prisma/prisma.js'
import { UserNotFoundError } from '../../../errors/index.js'

export class PostgresDeleteUserRepository {
    async execute(userId) {
        try {
            return await prisma.user.delete({
                where: {
                    id: userId,
                },
            })
        } catch (error) {
            for (const [key, value] of Object.entries(error)) {
                console.log(`${key}:`, value)
            }
            if (error.name === 'PrismaClientKnownRequestError') {
                // P2025 -> An operation failed because it depends on one or more records that were required but not found. {cause}
                if (error.code === 'P2025') {
                    throw new UserNotFoundError(userId)
                }
            }

            throw error
        }
    }
}
