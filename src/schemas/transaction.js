import { z } from 'zod'
import validator from 'validator'

export const createTransactionSchema = z.object({
    user_id: z
        .string({
            required_error: 'User id is required',
        })
        .uuid({
            message: 'User id must be a valid uuid',
        }),
    name: z
        .string({
            required_error: 'Name is required',
        })
        .trim()
        .min(1, {
            message: 'Name is required',
        }),
    date: z
        .string({
            required_error: 'Date is required',
        })
        .datetime({
            message: 'Date must be a valid date',
        }),
    type: z.enum(['EARNING', 'EXPENSE', 'INVESTMENT'], {
        errorMap: () => ({
            message: 'The type must be: EARNING, EXPENSE, INVESTMENT',
        }),
    }),
    amount: z
        .number({
            required_error: 'The amount is required',
            invalid_type_error: 'Amount must be a number',
        })
        .min(1, {
            message: 'Amount must be greater than 0',
        })
        .refine((value) =>
            validator.isCurrency(value.toFixed(2), {
                digits_after_decimal: [2],
                allow_negatives: false,
                decimal_separator: '.',
            }),
        ),
})
