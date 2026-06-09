import { Router } from "express";

import mysql, {
  type RowDataPacket,
  type ResultSetHeader,
} from "mysql2/promise";
import MysqlErrorHandle from "../service.js";
import connection from "../mysql_connectio.js";
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
routes.post("/cadastro_produtso", async(req,res)=>{
  const {id, nome, categoria, preco, data_criacao, data_modificacao} = req.body
  try {
    const [result] = await connection.execute<ResultSetHeader>(
      "INSERT INTO produtos VALUES (?,?,?,?,?,?)",
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
    "SELECT * FROM produtos"
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
      "SELECT * FROM produtos WHERE preco > 100"
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
    console.log("chamou a função  ")
     const [dados, campos] = await connection.execute(
      "SELECT nome,datapedido FROM clientes c INNER JOIN pedidos p ON c.idclientes=p.clientes_idclientes"
    )
    res.status(200).json(dados)
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
    res.status(200).json(dados)
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
    res.status(200).json(dados)
  } catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err, res)
    mysqlErrorHandle.verificaErroDB()
  }
})

routes.post("/cadastrar_clientes", async (req,res) =>{
  const {id, nome, cidade, idade} = req.body
  if (id == null || id == "" || nome == null || nome == "") {
    res.status(400).json({mesage:"o nome ou o id não podem ser vazios"})
  }
  try {
    const [result] = await connection.execute<ResultSetHeader>("INSERT INTO clientes VALUES (?,?,?,?)", [id, nome, cidade, idade])
    res.status(201).json({mensage: "sucesso ao inserir"},)
  } catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err,res)
    mysqlErrorHandle.verificaErroDB()
  }
})

routes.post("/cadastro_produto_v2", async (req,res) =>{
  const {id, nome, preco, categoria} = req.body
  const data_criacao = new Date()

  try {
    const [result] = await connection.execute<ResultSetHeader>(`INSERT INTO produto VALUES (?,?,?,?,?,?)`, [id, nome, categoria, preco, data_criacao, null])
    res.status(201).json({mensage: "sucesso ao inserir"},)
  } catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err,res)
    mysqlErrorHandle.verificaErroDB()
  }
})

routes.put("/produtos/:id", async(req,res)=>{
  const {id} = req.params
  let {nome, preco, categoria} = req.body

  if (!nome) {
    return res.status(400).json({mensagem:"O campo nome é obrigatório"})
  }

  preco = preco ?? null
  categoria = categoria ?? null

  try {
    const [result] = await connection.execute<ResultSetHeader>("UPDATE produto SET nome = ?, preco = ?, categoria = ? where id = ?", [nome,preco,categoria,id])
    res.status(200).json({mensage:"Sucesso ao atualizar"})
  } catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err,res)
    mysqlErrorHandle.verificaErroDB()
  }
})

// routes.put("/produtos/:id", async(req,res)=>{
//   const {id} = req.params
//   let {nome} = req.body

//   if (!nome) {
//     return res.status(400).json({mensagem:"O campo nome é obrigatório"})
//   }
//   try {
//     const [result] = await connection.execute<ResultSetHeader>("UPDATE produto SET nome = ? where id = ?", [nome,id])
//     res.status(200).json({mensage:"Sucesso ao atualizar"})
//   } catch (err) {
//     const mysqlErrorHandle = new MysqlErrorHandle(err,res)
//     mysqlErrorHandle.verificaErroDB()
//   }
// })


/*
## Exercício 2
**Na exercício anterior, criamos juntos a rota PUT /produto/:id que atualiza um produto no banco. 
Porém, o código que fizemos possui um problema: se o cliente não enviar todos os campos no body, 
os campos não enviados são sobrescritos com null, apagando os dados que já estavam salvos no banco.**
*/
routes.put("/produto/:id", async(req,res)=>{
  const {id} = req.params
  let {nome, preco, categoria} = req.body

  if (!nome) {
    return res.status(400).json({mensagem:"O campo nome é obrigatório"})
  }

   preco = preco  ?? null
   categoria = categoria ?? null
 
  try {
   
    const [result] = await connection.execute<ResultSetHeader>("UPDATE produto SET nome = ?, preco = ?, categoria = ? where id = ?", [nome,preco,categoria,id])
    res.status(200).json({mensage:"Sucesso ao atualizar"})
  } catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err,res)
    mysqlErrorHandle.verificaErroDB()
  }
})

/*
## Exercício 3
Atualizar preço com data_modificacao automática
Enunciado: Crie a rota PUT /produto_preco/:id.
Recebe o id pela URL e o novo preço pelo body. 
Além do preço, o servidor deve atualizar data_modificacao automaticamente com new Date(). 
Retornar 404 se não encontrar, 200 se atualizar./
*/
routes.put("/produto_preco/:id", async(req,res)=>{
  const {id} = req.params
  let {nome, preco, categoria} = req.body

  if (!nome) {
    return res.status(400).json({mensagem:"O campo nome é obrigatório"})
  }

  let Novopreco = preco 
  let Novacategoria = categoria
  let data_modificacao = new Date()
  try {
    const [result] = await connection.execute<ResultSetHeader>("UPDATE produto SET nome = ?, preco = ?, categoria = ?, data_modificacao = ? where id = ?",
      [nome,Novopreco,Novacategoria,data_modificacao ,id])
    res.status(200).json({mensage:"Sucesso ao atualizar"})
  } catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err,res)
    mysqlErrorHandle.verificaErroDB()
  }
})

/*
## Exercício 4

**Crie a rota PUT /produto_completo/:id. Recebe o id pela URL e qualquer combinação de nome, preco e categoria pelo body. 
O servidor deve buscar o produto no banco antes de atualizar — se não existir, retornar 404. 
Para cada campo não enviado, manter o valor original do banco usando o operador ??. Atualizar também data_modificacao com new Date().
Retornar 200 com mensagem de sucesso.**
*/
routes.put("/produto_completo/:id", async(req,res)=>{
  const {id} = req.params
  
  let {nome, preco, categoria} = req.body
  try {
    const [dados] = await connection.execute<RowDataPacket[]>("SELECT * FROM produto where id = ?", [id])

    if (dados.length == 0) {
      return res.status(404).json({mensagem:"não tem nenhum produto"})
    }
  const produtos = dados[0]
  nome = nome ?? produtos!.nome
  preco = preco ?? produtos!.preco
  categoria = categoria ?? produtos!.categoria
  let data_modificacao = new Date()
    
    const [result] = await connection.execute<ResultSetHeader>("UPDATE produto SET nome = ?, preco = ?, categoria = ?, data_modificacao = ? where id = ?",
      [nome,preco,categoria,data_modificacao ,id])
    res.status(200).json({mensage:"Sucesso ao atualizar"})
  } catch (err) {
    const mysqlErrorHandle = new MysqlErrorHandle(err,res)
    mysqlErrorHandle.verificaErroDB()
  }
})

export default routes;
