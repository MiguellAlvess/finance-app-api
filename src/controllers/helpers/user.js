import { badRequest, notFound } from './http.js'
import validator from 'validator'

export const invalidPasswordResponse = () =>
    badRequest({
        message: 'Password must have at least 6 characters',
    })

export const emailIsAlreadyInUseResponse = () =>
    badRequest({
        message: 'Invalid e-mail. Please provide a valid one',
    })

export const invalidIdResponse = () =>
    badRequest({
        message: 'The provided id is not valid',
    })

export const userNotFoundResponse = () =>
    notFound({
        message: 'User not found',
    })

export const checkIfPasswordIsValid = (password) => {
    return password.length >= 6
}

export const checkIfEmailIsValid = (email) => validator.isEmail(email)

export const checkIfIdIsValid = (id) => validator.isUUID(id)
