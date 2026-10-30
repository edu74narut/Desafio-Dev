import { Request, Response } from "express";
import * as PlantaRepository from "@repositories/PlantaRepository"
import { Luminosidade } from "@prisma/client";

export const createPlanta =  async(req: Request, res:Response) => {
    try{
        const {
            nome,
            especie,
            preco,
            estoque,
            luminosidade,
            petFriend,
            regaACadaDias
        } = req.body?? {};

        if(
            typeof nome != "string" || !nome.trim() ||
            typeof especie != "string" || !especie.trim()
        ){
            return res.status(400).json({
                message:"Nome e espécie obrigatórios!"
            });
        }

        if(!Number.isSafeInteger(estoque) || estoque < 0){
            return res.status(400).json({
                message: "Estoque não pode ser negativo!"
            });
        }

        if(!Object.values(Luminosidade).includes(luminosidade)){
            return res.status(400).json({
                message: "Luminosidade inválida!"
            })
        }

        if(typeof petFriend != "boolean"){
            return res.status(400).json({
                message:"petFriendly deve ser um valor boleano!"
            });
        }

        if(!Number.isSafeInteger(regaACadaDias) || regaACadaDias < 1){
            return res.status(400).json({
                message: "regaACadaDias deve ser um inteiro maior que 1!"
            });
        }



        const planta = await PlantaRepository.createPlanta({
                nome: nome.trim(),
                especie: especie.trim(),
                preco, 
                estoque,
                luminosidade,
                petFriend,
                regaACadaDias
            });
        return res.status(201).json(planta);
    }
    catch(error){
        res.status(500).json({
            message:"Erro ao cadastrar planta."
        })
    }
}