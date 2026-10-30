
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const plantas = [
    {
        nome: "Samambaia",
        especie: "Nephrolepis exaltata",
        preco: 4590,
        estoque: 8,
        luminosidade: "MEIA_SOMBRA",
        petFriendly: true,
        regaACadaDias: 2
    },
    {
        nome: "Jiboia",
        especie: "Epipremnum aureum",
        preco: 3590,
        estoque: 0,
        luminosidade: "MEIA_SOMBRA",
        petFriendly: false,
        regaACadaDias: 5
    },
    {
        nome: "Clorofito",
        especie: "Chlorophytum comosum",
        preco: 2990,
        estoque: 12,
        luminosidade: "SOMBRA",
        petFriendly: true,
        regaACadaDias: 3
    }
];

async function main() {
    for (const planta of plantas) {
        const existente = await prisma.planta.findFirst({
            where: {
                nome: planta.nome,
                especie: planta.especie
            }
        });

        if (!existente) {
            await prisma.planta.create({
                data: planta
            });

            console.log(`Planta cadastrada: ${planta.nome}`);
        }
    }
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
