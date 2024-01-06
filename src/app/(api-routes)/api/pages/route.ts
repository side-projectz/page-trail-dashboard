import { NextResponse } from "next/server";
import { addPage, getAllPages } from "@/lib/actions/database/page";
import { IDomain, IPage } from "@/lib/interface";
import { addDomain, getDomainByName } from "@/lib/actions/database/domain";

export async function GET(req: Request) {
  try {
    const pages = await getAllPages();
    return NextResponse.json(pages);
  }
  catch (error: any) {
    return NextResponse.json({
      message: "Error getting page records: " + error.message,
      data: null,
      status: 500
    });
  }

}

export async function POST(req: Request) {
 
  try {
    const body   = await req.json();
    const {url, meta_title, meta_description, meta_image,domain_name} = body;

    if (!url) throw new Error("Url is required");
    if(typeof url !== "string") throw new Error("Url should be a string");

    if (!domain_name) throw new Error("Domain Name is required");
    if(typeof domain_name !== "string") throw new Error("Domain Name should be a string");

    const domainId = await getDomainId(domain_name);

    if(!domainId) throw new Error("Domain Name not found");

    const page:IPage = {     
      domainId:  domainId, url: url, meta_title, meta_description, meta_image,createdAt : new Date(), updatedAt: new Date()
    };

    const pageRes = await addPage(page);
    return NextResponse.json(pageRes);
    
  } catch (error: any) {
    return NextResponse.json({
      message: "Error adding page records, " + error.message,
      data: error,
      status: 500
    });
  }

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