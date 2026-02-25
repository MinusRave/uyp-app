import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const errors = await prisma.aiLog.findMany({
        where: {
            action: 'fullReportV2_part2',
            status: 'error'
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 5
    });

    console.log(JSON.stringify(errors, null, 2));
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
