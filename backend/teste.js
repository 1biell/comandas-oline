const pool = require('./models/pedidosModel');

async function test() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Conectado! Hora do banco:', res.rows[0]);
  } catch (err) {
    console.error('Erro na conexão:', err);
  }
}

test();
