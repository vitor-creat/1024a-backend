import { Router } from "express";

import mysql, {
  type RowDataPacket,
  type Connection,
  type ResultSetHeader,
} from "mysql2/promise";
import MysqlErrorHandle from "./service.js";
import connection from "./mysql_connectio.js";
const routes = Router();

////////////
interface IPessoa extends RowDataPacket {
  id: number;
  nome: "string";
}

interface IProduto extends RowDataPacket{
  id:number,
  nome:string,
  categoria:string,
  preco:number,
  data_criacao:Date,
  data_modificacao:Date 
}

interface IPedidos extends RowDataPacket{
  cliente:string,
  quantidade:number,
  data_pedido:Date
}
////////////


routes.get("/pessoas", async (req, res) => {
  try {
    const [dados, campos] = await connection.execute<IPessoa[]>(
      "SELECT * FROM pessoa",
    );

    res.status(200).json(dados);
  } catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err,res)
    mysqlErrorHandle.verificaErroDB()
  }
});

routes.post("/pessoas", async (req, res) => {
  let { id, nome } = req.body;
  if (nome == null) {
    return res.status(500).json({ mensagem: "Erro ao passar o nome " });
  }
  if (id == null) {
    return res.status(500).json({ mensagem: "Erro ao passar o id " });
  }
  try {
    const [result] = await connection.execute<ResultSetHeader>(
      "INSERT INTO pessoa VALUES (?,?)",
      [id, nome],
    );
    if (result.affectedRows === 0)
      return res.status(500).json({ mensagem: "Erro ao inserir" });

    return res.status(201).json({ mensagem: "Sucesso ao inserir!" });
  } catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err,res)
    mysqlErrorHandle.verificaErroDB()
  }
});


// Crie uma rota chamada `cadastro_produto` que eu possa enviar
// um JSON para cadastrar um novo produto no banco de dados
routes.post("/cadastro_produto", async(req,res)=>{
  const {id, nome, categoria, preco, data_criacao, data_modificacao} = req.body
  try {
    const [result] = await connection.execute<ResultSetHeader>(
      "INSERT INTO produto VALUES (?,?,?,?,?,?)",
      [id, nome, categoria, preco, data_criacao, data_modificacao],
    );
    if (result.affectedRows === 0) {
      res.status(500).json({mensagem:"Erro ao inserir o produto"})
    }
    res.status(201).json({mensagem:"Sucesso ao inserir o produto"})
  } catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err,res)
    mysqlErrorHandle.verificaErroDB()
  }
})

routes.get("/listar_produtos", async(req,res)=>{
  try {
    const [dados, campos] = await connection.execute<IProduto[]>(
    "SELECT * FROM produto"
  )
  res.status(200).json({dados})
  } catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err,res)
    mysqlErrorHandle.verificaErroDB()
  }
  
})

 // Crie uma rota chamada `listar_produtos_informatica` que retorne
 // todos os produtos da categoria informatica

routes.get("/listar_produtos_informatica", async(req,res)=>{
  try {
    const [dados, campos] = await connection.execute<IProduto[]>(
      "SELECT * FROM produto WHERE categoria = 'informatica'"
    )
    res.status(200).json(dados)
  } catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err,res)
    mysqlErrorHandle.verificaErroDB()
  }
})

// Crie uma rota chamada `listar_produtos_caros` que retorne os produtos
// que custem mais de R$: 100,00

routes.get("/listar_produtos_caros", async(req,res)=>{
  try {
    const [dados, campos] = await connection.execute<IProduto[]>(
      "SELECT * FROM produto WHERE preco > 100"
    )
    res.status(200).json(dados)
  } catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err,res)
    mysqlErrorHandle.verificaErroDB()
  }
})

// 1......
// Crie uma rota '\cliente_data_pedido' que retorne os clientes e a data que os mesmos fizeram 
// o pedido. Para realizar isso, utilize o comando inner join para juntar as tabelas. 
// Utilize o banco de dados chamado  dbteremercado


routes.get("/cliente_data_pedido", async(req,res) =>{
  try {
     const [dados, campos] = await connection.execute(
      "SELECT nome,datapedido FROM clientes c INNER JOIN pedidos p ON c.idclientes=p.clientes_idclientes"
    )
    res.status(200).json({dados})
  } catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err, res)
    mysqlErrorHandle.verificaErroDB()
  }
})
//  "SELECT nome,datapedido FROM clientes c ",
//  "INNER JOIN pedidos p ON c.idclientes=p.clientes_idclientes"
// 2 Crie uma rota chamada '\pedidos_2026' que retorne 
// idclientes, nome, cidade, idade,idpedidos,datapedido dos pedidos feitos no ano
// de 2026.

routes.get("/pedidos_2026", async(req, res) => {
  try {
    const [dados, campos] = await connection.execute(
      "SELECT idclientes, nome, cidade, idade, idpedidos, datapedido FROM clientes c INNER JOIN pedidos p ON c.idclientes=p.clientes_idclientes WHERE datapedido BETWEEN '2026-01-01' AND '2026-12-31';"
    )
    res.status(200).json({dados})
  } catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err, res)
    mysqlErrorHandle.verificaErroDB()
  }
})

// 3.Crie uma rota chamada '\quantidade_pedidos' que retorne 
// um json no formato '{quantidade_pedidos:100}' com a quantidade de pedidos cadastrados
// na tabela pedidos. USE O COMANDO COUNT(*) para contar as quantidades.

routes.get("/quantidade_pedidos", async(req,res)=>{
  try {
    const [dados,campos] = await connection.execute<IPedidos[]>("SELECT COUNT(*) AS quantidade_pedidos FROM itenspedidos") 
    res.status(200).json(...dados)
  } catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err,res)
    mysqlErrorHandle.verificaErroDB()
  }
})

// 4 Crie uma rota chamada '\quantidade_pedidos_clientes' que retorne
// um json no formato '[{nome:"tere",quantidade_pedidos:1000}]' que retorne 
// todos os clientes e a quantidade de pedidos que cada cliente fez

 routes.get("/quantidade_pedido_clientes", async(req, res) => {
  try {
    const [dados, campos] = await connection.execute(
      "SELECT clientes.nome, COUNT(pedidos.idpedidos) FROM clientes INNER JOIN pedidos ON clientes.idclientes = pedidos clientes_idclientes GROUP BY clientes.nome;",
    )
    res.status(200).json({dados})
  } catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err, res)
    mysqlErrorHandle.verificaErroDB()
  }
})


export default routes;
