import { Prisma } from '@prisma/client'
import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetUserBalanceRepository {
    async execute(userId, from, to) {
        const dateFiler = {
            date: {
                gte: new Date(from),
                lte: new Date(to),
            },
        }
        const { _sum: totalExpenses } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: 'EXPENSE',
                ...dateFiler,
            },
            _sum: {
                amount: true,
            },
        })

        const { _sum: totalEarnings } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: 'EARNING',
                ...dateFiler,
            },
            _sum: {
                amount: true,
            },
        })

        const { _sum: totalInvestments } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: 'INVESTMENT',
                ...dateFiler,
            },
            _sum: {
                amount: true,
            },
        })

        const _totalEarnings = totalEarnings.amount || new Prisma.Decimal(0)
        const _totalExpenses = totalExpenses.amount || new Prisma.Decimal(0)
        const _totalInvestments =
            totalInvestments.amount || new Prisma.Decimal(0)

        const balance = new Prisma.Decimal(
            _totalEarnings - _totalExpenses - _totalInvestments,
        )

        return {
            earnings: _totalEarnings,
            expenses: _totalExpenses,
            investments: _totalInvestments,
            balance,
        }
    }
}
