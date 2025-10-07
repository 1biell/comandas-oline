const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Empresa = require('../models/empresaModel');

const SECRET = process.env.JWT_SECRET || 'chavesecreta';

exports.registrar = async (req, res) => {
  try {
    const { nome, email, senha, telefone, cnpj } = req.body;

    const existente = await Empresa.buscarPorEmail(email);
    if (existente) return res.status(400).json({ error: 'E-mail já cadastrado' });

    const senha_hash = await bcrypt.hash(senha, 10);
    const empresa = await Empresa.criar({ nome, email, senha_hash, telefone, cnpj });

    res.status(201).json({ message: 'Empresa cadastrada com sucesso', empresa });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const empresa = await Empresa.buscarPorEmail(email);

    if (!empresa) return res.status(404).json({ error: 'Empresa não encontrada' });

    const senhaValida = await bcrypt.compare(senha, empresa.senha_hash);
    if (!senhaValida) return res.status(401).json({ error: 'Senha incorreta' });

    const token = jwt.sign(
      { empresaId: empresa.id, nome: empresa.nome },
      SECRET,
      { expiresIn: '8h' }
    );

    res.json({ message: 'Login realizado com sucesso', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
