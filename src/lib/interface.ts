export interface IUser {
  id: string
  name: string
  email: string
  image: string
}


export interface IDomain {
  id?: string
  name: string
  createdAt: Date,
  updatedAt: Date,
}


export interface IPage {
  id: string
  domainId: string,
  url: string,
  meta_title: string,
  meta_description: string,
  meta_image: string,  
  createdAt: Date,
  updatedAt: Date
}


export interface ISite {
  id: string
  pageId: string,
  domainId: string,
  userId: string,
  startDateTime: Date
  endDateTime: Date
}