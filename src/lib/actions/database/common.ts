import { ISite, IDomain, IPage } from "@/lib/interface";
import { getDomainByName, addDomain } from "./domain";
import { addPage, getPageByUrl } from "./page";
import { addSite } from "./site";
import { getUserDetails } from "./user";

type syncUserRecordsBody = {
  url: string;
  meta_title: string;
  meta_description: string;
  meta_image: string;
  domain_name: string;
  userId: string;
  startDateTime: string;
  endDateTime: string;
}


export async function syncUserRecords(email: string, body: syncUserRecordsBody) {
  try {
    // const body = await req.json();
    const { url, meta_title, meta_description, meta_image, domain_name, userId } = body;
    const { startDateTime, endDateTime } = body

    if (!userId) throw new Error("User Id is required");
    if (userId && typeof userId !== "string") throw new Error("User Id should be a string");

    const userDetails = await getUserDetails(userId);

    if (!userDetails) throw new Error("User not found");

    if (!url) throw new Error("Url is required");
    if (typeof url !== "string") throw new Error("Url should be a string");

    if (!domain_name) throw new Error("Domain Name is required");
    if (typeof domain_name !== "string") throw new Error("Domain Name should be a string");

    if (!startDateTime) throw new Error("Start Date Time is required");
    if (startDateTime && typeof startDateTime !== "string") throw new Error("Start Date Time should be a string");

    if (!endDateTime) throw new Error("End Date Time is required");
    if (endDateTime && typeof endDateTime !== "string") throw new Error("End Date Time should be a string");

    const domainId = await getDomainId(domain_name);
    if (!domainId) throw new Error("Domain Name not found");

    const pageId = await getPageId(url, meta_title, meta_description, meta_image, domainId);
    if (!pageId) throw new Error("Page Url not found");

    const site: ISite = {
      pageId,
      domainId,
      userId: userDetails.id,
      startDateTime: new Date(+startDateTime),
      endDateTime: new Date(+endDateTime)
    }

    const siteRes = await addSite(site);

    return siteRes;
    // return NextResponse.json(siteRes);

  } catch (error: any) {
    console.log(error)
    throw new Error(error.message);
    // return NextResponse.json({
    //   message: "Error adding page records, " + error.message,
    //   data: error,
    //   status: 500
    // });
  }
}


async function getDomainId(domain_name: string) {

  const domain = await getDomainByName(domain_name);
  // if(!domainId) throw new Error("Domain Name not found");

  let domainId;
  // save domain if not exists
  if (!domain) {
    const domainObj: IDomain = {
      name: domain_name, createdAt: new Date(), updatedAt: new Date()
    };
    const domainRes = await addDomain(domainObj); //save domain
    domainId = domainRes.id;
  } else {
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
async function getPageId(url: string, meta_title: string, meta_description: string, meta_image: string, domainId: string) {

  const page = await getPageByUrl(url);
  // if(!page) throw new Error("Page Url not found");

  let pageId;
  if (!page) {
    const page: IPage = {
      domainId: domainId, url: url, meta_title, meta_description, meta_image, createdAt: new Date(), updatedAt: new Date()
    };

    const pageRes = await addPage(page);
    pageId = pageRes.id;
  } else {
    pageId = page.id;
  }
  return pageId;
}
