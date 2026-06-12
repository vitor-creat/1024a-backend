import { response, Router } from "express";

import mysql, {
  type RowDataPacket,
  type ResultSetHeader,
} from "mysql2/promise";
import MysqlErrorHandle from "../service.js";
import connection from "../mysql_connectio.js";
import { ExpressResponse } from "../adapters/ExpressAdapter.js";
const routes = Router();




routes.post("/cadastrar_clientes", async (req,res) =>{
  const {id, nome, cidade, idade} = req.body
  if (id == null || id == "" || nome == null || nome == "") {
    res.status(400).json({mesage:"o nome ou o id não podem ser vazios"})
  }
  try {
    const [result] = await connection.execute<ResultSetHeader>("INSERT INTO clientes (id, nome, categoria, preco, data_criacao, data_modificacao) VALUES (?,?,?,?)", [id, nome, cidade, idade])
    res.status(201).json({mensage: "sucesso ao inserir"},)
  } catch (err) {
    const adapter = new ExpressResponse(res)
    const mysqlErrorHandle = new MysqlErrorHandle(err,adapter)
    mysqlErrorHandle.verificaErroDB()
  }
})

routes.post("/cadastro_produto_v2", async (req,res) =>{
  const {id, nome, preco, categoria} = req.body
  const data_criacao = new Date()

  try {
    const [result] = await connection.execute<ResultSetHeader>(`INSERT INTO produto (id, nome, categoria, preco, data_criacao, data_modificacao) VALUES (?,?,?,?,?,?)`, [id, nome, categoria, preco, data_criacao, null])
    res.status(201).json({mensage: "sucesso ao inserir"},)
  } catch (err) {
    const adapter = new ExpressResponse(res)
    const mysqlErrorHandle = new MysqlErrorHandle(err,adapter)
    mysqlErrorHandle.verificaErroDB()
  }
})

/*## Exercício 3


exercício 3
Crie a rota POST /cadastro_multiplos_produtos que recebe um
array de produtos no body. Para cada produto, inserir no banco
com data_criacao automática e data_modificacao null. Retornar 201
com a mensagem "X produtos cadastrados com sucesso!".
*/
 
routes.post("/cadastro_multiplos_produtos", async (req,res) =>{
  // const {produtos} = req.body
  const produtos = req.body
  try {
    for (let i = 0; i < produtos.length; i++) {
    const produto = produtos[i]

    await connection.execute(`INSERT INTO produto (id, nome, categoria, preco, data_criacao, data_modificacao) VALUES (?,?,?,?,NOW(),NULL)`, [produto.id, produto.nome, produto.categoria, produto.preco])
    }
    res.status(201).json({mensage: `${produtos.length} produtos cadastrados com sucesso!`})
  } catch (err) {
    const adapter = new ExpressResponse(res)
    const mysqlErrorHandle = new MysqlErrorHandle(err,adapter)
    mysqlErrorHandle.verificaErroDB()
  }


})


/* Exercício 1 de put.*/
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
    const adapter = new ExpressResponse(res)
    const mysqlErrorHandle = new MysqlErrorHandle(err,adapter)
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
    const adapter = new ExpressResponse(res)
    const mysqlErrorHandle = new MysqlErrorHandle(err,adapter)
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
    const adapter = new ExpressResponse(res)
    const mysqlErrorHandle = new MysqlErrorHandle(err,adapter)
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
    const adapter = new ExpressResponse(res)
    const mysqlErrorHandle = new MysqlErrorHandle(err,adapter)
    mysqlErrorHandle.verificaErroDB()
  }
})






export default routes;
