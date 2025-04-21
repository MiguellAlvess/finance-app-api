import { PostgresHelper } from '../../db/postgres/helper'

export class PostgresCreateUserRepository {
    async execute(createUsersParams) {
        // create user in postgres

        const results = await PostgresHelper.query(
            'INSERT INTO users (ID, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5)',

            [
                createUsersParams.ID,
                createUsersParams.first_name,
                createUsersParams.last_name,
                createUsersParams.email,
                createUsersParams.password,
            ],
        )

        return results[0]
    }
}
