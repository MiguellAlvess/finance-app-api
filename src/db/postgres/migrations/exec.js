import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool } from '../helper.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const execMigrations = async () => {
    const client = await pool.connect()
    try {
        const files = fs
            .readdirSync(__dirname)
            .filter((file) => file.endsWith('.sql'))

        for (const file of files) {
            const filePath = path.join(__dirname, file)
            const scripts = fs.readFileSync(filePath, 'utf-8')
            await client.query(scripts)
            console.log(`Migration ${file} executed successfully`)
        }

        console.log('All Migrations were executed successfully!')
    } catch (error) {
        console.error(error)
    } finally {
        await client.release()
    }
}

execMigrations()
