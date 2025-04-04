// Importa o framework Express.
const express = require('express');

// Importa o middleware morgan para log de requisições HTTP.
const morgan = require('morgan');

// Importa o pacote CORS
const cors = require('cors');

// Importa as rotas relacionadas a "clientes".
const clientesRoutes = require('./routes/clientesRoutes');

// Importa as rotas relacionadas a "produtos".
const produtosRoutes = require('./routes/produtosRoutes');

// Cria a instância do aplicativo Express.
const app = express();

// Usa o middleware morgan no modo "dev" para log detalhado das requisições.
app.use(morgan('dev'));

// Usa o middleware CORS para permitir requisições de diferentes origens
app.use(cors());

// Middleware para analisar JSON nas requisições.
app.use(express.json());

// Define as rotas de clientes com prefixo "/clientes".
app.use('/clientes', clientesRoutes);

// Define as rotas de produtos com prefixo "/produtos".
app.use('/produtos', produtosRoutes);

// Rota padrão para o caminho raiz.
app.get('/', (req, res) => {
    // Responde com uma mensagem simples na página inicial.
    res.send('Bem-vindo à API!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    // Inicia o servidor e exibe uma mensagem no console.
    console.log(`Servidor rodando na porta ${PORT}`);
});
