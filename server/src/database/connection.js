const { Pool, types } = require('pg') 

types.setTypeParser(1700, (valor) => parseFloat(valor))

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

pool.on('connect', () => {
  console.log('Conectado ao banco de dados PostgreSQL!');
});

pool.on('error', (err) => {
  console.error('Erro inesperado no cliente do pool de conexões:', err);
});

module.exports = pool