import { IPage } from "@/lib/interface";
import prisma from "@/lib/prisma";

export async function getAllPages(): Promise<IPage[]> {
  try {
    const pages = await prisma.page.findMany({
      
    });

    return pages as IPage[];
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message);
  }
}

export async function addPage(page: IPage): Promise<IPage> {
  try {
    const pageRes = await prisma.page.create({
      data: page
    });

    return pageRes as IPage;
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message);
  }
}

export async function getPageById(id: string): Promise<IPage> {
  try {
    const page = await prisma.page.findUnique({
      where: {
        id: id
      }
    });

    return page as IPage;
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message);
  }
}

export async function updatePageById(id: string, page: IPage): Promise<IPage> {
  try {
    const pageRes = await prisma.page.update({
      where: {
        id: id
      },
      data: page
    });

    return pageRes as IPage;
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message);
  }
}

export async function deletePageById(id: string): Promise<IPage> {
  try {
    const pageRes = await prisma.page.delete({
      where: {
        id: id
      }
    });

    return pageRes as IPage;
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message);
  }
}
