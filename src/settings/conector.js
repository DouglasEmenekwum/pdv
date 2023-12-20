const knex = require('knex')({
    client: 'pg',
    connection: {
        user: 'postgres',
        host: 'localhost',
        password: 'postgres',
        database: 'ponto_de_venda',
        port: 5432
    },
    useNullAsDefault: true
});

module.exports = knex