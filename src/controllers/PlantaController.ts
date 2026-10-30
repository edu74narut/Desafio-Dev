import { Request, Response } from "express";
import * as PlantaRepository from "@repositories/PlantaRepository"
import { Luminosidade, Prisma } from "@prisma/client";

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

export const getPlantas = async(req: Request, res: Response) => {
    try{
        const { luminosidade, petFriend } = req.query;
        const filtros: Prisma.PlantaWhereInput = {};
        
        if(luminosidade !== undefined){
            if(
                typeof luminosidade !== "string" ||
                !Object.values(Luminosidade).includes(luminosidade as Luminosidade)
            )
            
            return res.status(400).json({
                message:"Luminosidade inválida!"
            });
            
            filtros.luminosidade = luminosidade as Luminosidade;
        }

        if(petFriend !== undefined){
            if(petFriend !== "true" && petFriend !== "false"){
                return res.status(400).json({
                    message: "PetFriend deve ser true ou false!"
                });
            }
            filtros.petFriend = petFriend ==="true";
        }

        const plantas = await PlantaRepository.getPlantas(filtros);
        return res.status(200).json(plantas)
    }
    catch(error){
        return res.status(500).json({
            message: "Erro ao buscar plantas!"
        })

    }
}

export const getPlantaId = async (req:Request, res:Response) => {
    try{
        const id = Number(req.params.id);

        if(!Number.isSafeInteger(id) || id<=0) {
            return res.status(400).json({
                message: "ID inválido!"
            });
        }

        const planta = await PlantaRepository.getPlantasId(id);

        if(!planta){
            return res.status(404).json({
                message: "Planta não encontrada!"
            });
        }

        return res.status(200).json(planta);
    } catch(error){
        return res.status(500).json({
            message: "Erro ao buscar planta!"
        });
    }
}

export const updatePlanta = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "ID inválido."
            });
        }

        const body = req.body;

        if (!body || typeof body !== "object" || Array.isArray(body)) {
            return res.status(400).json({
                message: "Corpo da requisição inválido."
            });
        }

        const camposPermitidos = [
            "nome", "especie", "preco", "estoque",
            "luminosidade", "petFriend", "regaACadaDias"
        ];

        const campos = Object.keys(body);

        if (campos.some(campo => !camposPermitidos.includes(campo))) {
            return res.status(400).json({
                message: "A requisição contém campos não permitidos."
            });
        }

        const data: Prisma.PlantaUpdateInput = {};

        if (body.nome !== undefined) {
            if (typeof body.nome !== "string" || !body.nome.trim()) {
                return res.status(400).json({
                    message: "Nome inválido."
                });
            }
            data.nome = body.nome.trim();
        }

        if (body.especie !== undefined) {
            if (typeof body.especie !== "string" || !body.especie.trim()) {
                return res.status(400).json({
                    message: "Espécie inválida."
                });
            }
            data.especie = body.especie.trim();
        }

        if (body.preco !== undefined) {
            if (!Number.isSafeInteger(body.preco) || body.preco <= 0) {
                return res.status(400).json({
                    message: "Preço inválido."
                });
            }
            data.preco = body.preco;
        }

        if (body.estoque !== undefined) {
            if (!Number.isSafeInteger(body.estoque) || body.estoque < 0) {
                return res.status(400).json({
                    message: "Estoque inválido."
                });
            }
            data.estoque = body.estoque;
        }

        if (body.luminosidade !== undefined) {
            if (!Object.values(Luminosidade).includes(body.luminosidade)) {
                return res.status(400).json({
                    message: "Luminosidade inválida."
                });
            }
            data.luminosidade = body.luminosidade;
        }

        if (body.petFriend !== undefined) {
            if (typeof body.petFriend !== "boolean") {
                return res.status(400).json({
                    message: "petFriendly deve ser booleano."
                });
            }
            data.petFriend = body.petFriend;
        }

        if (body.regaACadaDias !== undefined) {
            if (
                !Number.isSafeInteger(body.regaACadaDias) ||
                body.regaACadaDias < 1
            ) {
                return res.status(400).json({
                    message: "Frequência de rega inválida."
                });
            }
            data.regaACadaDias = body.regaACadaDias;
        }

        const planta = await PlantaRepository.updatePlanta(id, data);

        return res.status(200).json(planta);

    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            return res.status(404).json({
                message: "Planta não encontrada."
            });
        }

        return res.status(500).json({
            message: "Erro ao atualizar planta."
        });
    }
};

export const deletePlanta = async(req:Request, res:Response) => {
    try{
        const id = Number(req.params.id);

        if(!Number.isSafeInteger(id) || id <=0){
            return res.status(400).json({
                message:"ID inválido!"
            });
        }

        await PlantaRepository.deletePlanta(id);
        return res.status(200).json({
            message: "Planta deletada com sucesso!"
        })
    } catch(error){
        if(
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ){
            return res.status(404).json({
                    message: "Planta não encontrada!"
                }
            )
        }

        return res.status(500).json({
            message: "Erro ao excluir planta!"
        })

    }
}