import { IDomain } from "@/lib/interface";
import prisma from "@/lib/prisma";

export async function getAllDomains(): Promise<IDomain[]> {
  try {
    const domains = await prisma.domain.findMany({
      
    });

    return domains as IDomain[];
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message);
  }
}

export async function addDomain(domain: IDomain): Promise<IDomain> {
  try {
    const domainRes = await prisma.domain.create({
      data: domain
    });

    return domainRes as IDomain;
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message);
  }
}

export async function getDomainById(id: string): Promise<IDomain> {
  try {
    const domain = await prisma.domain.findUnique({
      where: {
        id: id
      }
    });

    return domain as IDomain;
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message);
  }
}

export async function updateDomainById(id: string, domain: IDomain): Promise<IDomain> {
  try {
    const domainRes = await prisma.domain.update({
      where: {
        id: id
      },
      data: domain
    });

    return domainRes as IDomain;
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message);
  }
}

export async function deleteDomainById(id: string): Promise<IDomain> {
  try {
    const domainRes = await prisma.domain.delete({
      where: {
        id: id
      }
    });

    return domainRes as IDomain;
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message);
  }
}

export async function getDomainByName(name: string): Promise<IDomain> {
  try {
    const domain = await prisma.domain.findUnique({
      where: {
        name: name
      }
    });

    return domain as IDomain;
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message);
  }
}

