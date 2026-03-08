const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(express.json()); // Permite que o Node entenda JSON

// 1. Configurar o Banco de Dados (SQLite - cria um arquivo chamado database.sqlite)
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './database.sqlite' });

// 2. Definir as Tabelas (Modelos)
const Order = sequelize.define('Order', {
    orderId: { type: DataTypes.STRING, primaryKey: true },
    value: { type: DataTypes.FLOAT },
    creationDate: { type: DataTypes.DATE }
});

const Item = sequelize.define('Item', {
    productId: { type: DataTypes.INTEGER },
    quantity: { type: DataTypes.INTEGER },
    price: { type: DataTypes.FLOAT }
});
Order.hasMany(Item, { foreignKey: 'orderId' });

// Sincronizar banco de dados
sequelize.sync();

// 3. Criar a Rota (Endpoint) de Criação (POST)
app.post('/order', async (req, res) => {
    try {
        const data = req.body;

        // MAPPING: Transforma o que vem no Body para o formato do Banco
        const novaOrdem = await Order.create({
            orderId: data.numeroPedido,
            value: data.valorTotal,
            creationDate: data.dataCriacao,
            Items: data.items.map(i => ({
                productId: parseInt(i.idItem),
                quantity: i.quantidadeItem,
                price: i.valorItem
            }))
        }, { include: [Item] });

        res.status(201).json(novaOrdem); // Resposta de Sucesso
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
});

// Iniciar o Servidor
app.listen(3000, () => console.log("🚀 Servidor rodando em http://localhost:3000"));