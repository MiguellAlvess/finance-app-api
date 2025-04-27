import { badRequest, notFound } from './http.js'

export const emailIsAlreadyInUseResponse = () =>
    badRequest({
        message: 'Invalid e-mail. Please provide a valid one',
    })

export const userNotFoundResponse = () =>
    notFound({
        message: 'User not found',
    })
