import { NextRequest, NextResponse } from "next/server";
import { addSite, getAllSites } from "@/lib/actions/database/site";
import { addDomain, getDomainByName } from "@/lib/actions/database/domain";
import { addPage, getPageById, getPageByUrl } from "@/lib/actions/database/page";
import { IDomain, IPage, ISite } from "@/lib/interface";
import { add } from "date-fns";

export async function GET(req: Request) {
  try {
    const sites = await getAllSites();
    return NextResponse.json(sites);
  }
  catch (error: any) {
    return NextResponse.json({
      message: "Error getting sites records: " + error.message,
      data: null,
      status: 500
    });
  }

}


export async function POST(req: Request) {
 
  try {
    const body   = await req.json();
    const {url, meta_title, meta_description, meta_image,domain_name,userId} = body;

    if (!url) throw new Error("Url is required");
    if(typeof url !== "string") throw new Error("Url should be a string");

    if (!domain_name) throw new Error("Domain Name is required");
    if(typeof domain_name !== "string") throw new Error("Domain Name should be a string");

    const domainId = await getDomainId(domain_name);
    if(!domainId) throw new Error("Domain Name not found");

    const pageId = await getPageId(url, meta_title, meta_description, meta_image,domainId);
    if(!pageId) throw new Error("Page Url not found");

    const site:ISite = {
      pageId: pageId, domainId: domainId, userId: userId, startDateTime: new Date(), endDateTime: new Date()
    }

    const siteRes = await addSite(site);

    return NextResponse.json(siteRes);
    
  } catch (error: any) {
    return NextResponse.json({
      message: "Error adding page records, " + error.message,
      data: error,
      status: 500
    });
  }

  
 async function getDomainId(domain_name: string) {
  
  const domain = await getDomainByName(domain_name);
    // if(!domainId) throw new Error("Domain Name not found");

    let domainId;
    // save domain if not exists
    if(!domain) {
      const domainObj:IDomain = {     
        name: domain_name,createdAt : new Date(), updatedAt: new Date()
      };  
      const domainRes = await addDomain(domainObj); //save domain
      domainId = domainRes.id;
    }else{
      domainId = domain.id;
    }
    return domainId;
}

/**
 * Get page id 
 * @param url 
 * @param meta_title 
 * @param meta_description 
 * @param meta_image 
 * @param domainId 
 * @returns 
 */
async function getPageId(url:string, meta_title:string, meta_description:string, meta_image:string,domainId:string) {
  
  const page = await getPageByUrl(url);
    // if(!page) throw new Error("Page Url not found");

    let pageId;
    if(!page) {
      const page:IPage = {     
        domainId:  domainId, url: url, meta_title, meta_description, meta_image,createdAt : new Date(), updatedAt: new Date()
      };
  
      const pageRes = await addPage(page);
      pageId = pageRes.id;
    }else{
      pageId = page.id;
    }
    return pageId;
}

}