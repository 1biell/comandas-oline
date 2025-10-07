const pool = require('../db');

class Empresa {
  static async criar({ nome, email, senha_hash, telefone, cnpj }) {
    const result = await pool.query(
      'INSERT INTO empresas (nome, email, senha_hash, telefone, cnpj) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nome, email, senha_hash, telefone, cnpj]
    );
    return result.rows[0];
  }

  static async buscarPorEmail(email) {
    const result = await pool.query('SELECT * FROM empresas WHERE email = $1', [email]);
    return result.rows[0];
  }
}

module.exports = Empresa;
