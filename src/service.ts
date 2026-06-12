import {type Response} from 'express'
import type { IHttpResponse } from './model/interfaces/IHttpResponse.js'

class MysqlErrorHandle {
    constructor(readonly error: unknown, readonly res:IHttpResponse){}

    
    verificaErroDB(){

        if (this.error instanceof Error && 'code' in this.error) {

        if (this.error.code === 'ECONNREFUSED' || this.error.code === 'EAI_AGAIN') {
            this.res.sendError(500, "ERRO: LIGUE O LARAGON e confira o usuário e senha da conexão" )
        } else if (this.error.code === 'ENOTFOUND') {
            this.res.sendError(500,  "ERRO: Você digitou algo errado no host da conexão")
        } else if (this.error.code === 'ER_BAD_DB_ERROR') {
            this.res.sendError(500, "ERRO: Confira o nome do banco de dados ou crie um banco com o nome que você passou na conexão" )
        } else if (this.error.code === 'ER_ACCESS_DENIED_ERROR') {
            this.res.sendError(500, "ERRO: Confira usuario e senha na conexão" )
        } else if (this.error.code === 'ER_PARSE_ERROR') {
            this.res.sendError(500, "ERRO: Você tem um erro na sua SQL, confira o Execute" )
        } else if (this.error.code === 'ER_NO_SUCH_TABLE') {
            this.res.sendError(500, "ERRO: Você digitou o nome da tabela errado, confira o Execute!" )
        }else if(this.error.code === ('ER_DUP_ENTRY')){
            this.res.sendError(500, "ERRO: Já exite um id cadastrado anteriormente no banco de dados" )
        }
        else {
            this.res.sendError(500,"ERRO: Desconhecido!" )
        }
        }


    }
}


export default MysqlErrorHandle