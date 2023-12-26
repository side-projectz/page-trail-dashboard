interface APIResponse<T> {
  status: number;
  message: string;
  data: T | null;
}


interface Domain {
  domainName: string
  pages: Page[]
}

interface Page {
  lastVisited: number
  page: string
  timeSpent: number
}
