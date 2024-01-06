import { ISite } from "@/lib/interface";
import prisma from "@/lib/prisma";
import exp from "constants";

export async function getAllSites(): Promise<ISite[]> {
  try {
    const sites = await prisma.site.findMany({
      
    });

    return sites as ISite[];
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message);
  }
}

export async function addSite(site: ISite): Promise<ISite> {
  try {
    const siteRes = await prisma.site.create({
      data: site
    });

    return siteRes as ISite;
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message);
  }
}

export async function getSiteById(id: string): Promise<ISite> { 
  try {
    const site = await prisma.site.findUnique({
      where: {
        id: id
      }
    });

    return site as ISite;
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message);
  }
}

export async function updateSiteById(id: string, site: ISite): Promise<ISite> {
  try {
    const siteRes = await prisma.site.update({
      where: {
        id: id
      },
      data: site
    });

    return siteRes as ISite;
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message);
  }
}

export async function deleteSiteById(id: string): Promise<ISite> {  
  try {
    const site = await prisma.site.delete({
      where: {
        id: id
      }
    });

    return site as ISite;
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message);
  }
}

export async function getSiteByDomain(domainId: string): Promise<ISite[]> { 
  try {
    const sites = await prisma.site.findMany({
      where: {
        domainId: domainId
      }
    });

    return sites as ISite[];
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message);
  }
}