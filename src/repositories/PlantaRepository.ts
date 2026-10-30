import { Prisma } from "@prisma/client"
import prisma from "@database"

export const createPlanta = async (data:Prisma.PlantaCreateInput) => {
    return await prisma.planta.create({
        data:data
    });
};

export const getPlantas = async (filtros: Prisma.PlantaWhereInput) => {
    return await prisma.planta.findMany({
        where: filtros
    });
};

export const getPlantasId = async(id:number) => {
    return await prisma.planta.findMany({
        where: {
            id: id
        }
    });
};