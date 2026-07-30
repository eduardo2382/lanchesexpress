const { Pool } = require('pg') 

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

pool.on('connect', () => {
  console.log('Conectado ao banco de dados PostgreSQL!');
});

pool.on('connect', () => {
  console.log('Conectado ao banco de dados PostgreSQL!');
});

pool.on('error', (err) => {
  console.error('Erro inesperado no cliente do pool de conexões:', err);
});

module.exports = pool