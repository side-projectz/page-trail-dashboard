import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient();
    // for viewing sql queries executed
    // globalWithPrisma.prisma = new PrismaClient({ log: ['query'] });
  }
  // advanced debugging
  //   const prisma = new PrismaClient({ log: [{ emit: "event", level: "query", },],})
  // prisma.$on("query", async (e) => {
  //     logger.info(`Query: ${e.query}`)
  //     logger.info(`Params: ${e.params}`)
  // });
  prisma = globalWithPrisma.prisma;
}

export default prisma;