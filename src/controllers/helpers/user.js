import { notFound, unauthorized, forbidden } from './http.js'

export const userNotFoundResponse = () =>
    notFound({
        message: 'User not found',
    })

export const userUnauthorizedResponse = () =>
    unauthorized({
        message: 'User unauthorized',
    })

export const forbiddenResponse = () =>
    forbidden({
        message: 'Forbidden',
    })
