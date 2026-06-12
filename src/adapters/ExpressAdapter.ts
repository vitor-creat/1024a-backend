import { type Response } from "express";
import type { IHttpResponse } from "../model/interfaces/IHttpResponse.js";

export class ExpressResponse implements IHttpResponse{

    constructor(private res:Response){}

    sendError(status: number, mensagem: string): void {
        this.res.status(status).json({ mensagem })
    }

}