const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: "postgres",
        password: process.env.PASSWORD,
        database: "MovieDB",
        port: 5433
    }
})

module.exports = knex;