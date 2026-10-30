import { Prisma } from "@prisma/client"
import prisma from "@database"

export const createPlanta = async (data:Prisma.PlantaCreateInput) => {
    return await prisma.planta.create({
        data:data
    });
}