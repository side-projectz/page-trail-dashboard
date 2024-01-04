interface APIResponse<T> {
  status: number;
  message: string;
  data: T | null;
}


interface Page {
  openedAt: number;
  page: string;
  timeSpent: number;
  domain: string;
  meta: {
    title: string;
    description: string;
    tags?: string[];
  };
  lastVisited: number;
}
