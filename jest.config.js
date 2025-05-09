/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
    coverageDirectory: 'coverage',

    coverageProvider: 'v8',

    collectCoverageFrom: ['src/**/*.js'],

    watchPathIgnorePatterns: ['<rootDir>/.postgres-data'],

    globalSetup: '<rootDir>/jest.global-setup.js',

    setupFilesAfterEnv: ['<rootDir>jest.setup-after-env.js'],
}

export default config
