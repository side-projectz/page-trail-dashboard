import { type ClassValue, clsx } from "clsx"
import deepmerge from "deepmerge";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface Domain {
  domain: string;
  pages: Page[];
}

// Function to merge two arrays based on a unique key
function mergeByUniqueKey<T>(uniqueKey: keyof T, array1: T[], array2: T[]): T[] {
  const merged: T[] = [...array1];
  array2.forEach(item => {
      const existingItemIndex = merged.findIndex(mergedItem => mergedItem[uniqueKey] === item[uniqueKey]);
      if (existingItemIndex > -1) {
          merged[existingItemIndex] = deepmerge(merged[existingItemIndex], item) as T;
      } else {
          merged.push(item);
      }
  });
  return merged;
}

/**
* This Login ADD the timeSpent from the existing timeSpent and the new timeSpent
* and also updates the lastVisited to the latest time
* 
* @param destinationArray 
* @param sourceArray 
* @returns 
*/
const mergePages = (destinationArray: Page[], sourceArray: Page[]): Page[] => {
  return sourceArray.reduce((acc, sourceItem) => {
      const existingItemIndex = acc.findIndex(item => item.page === sourceItem.page);
      if (existingItemIndex > -1) {
          const existingItem = acc[existingItemIndex];

          if (sourceItem.openedAt > existingItem.lastVisited) {
              existingItem.timeSpent += sourceItem.timeSpent;
          }

          existingItem.lastVisited = Math.max(existingItem.lastVisited, sourceItem.lastVisited);
      } else {
          acc.push({ ...sourceItem });
      }
      return acc;
  }, [...destinationArray]);
};

/**
* Custom merger function for the whole structure
* 
* @param x Original array
* @param y New array to merge
* @returns Merged array
*/
export const customDeepMerger = (x: Domain[], y: Domain[]): Domain[] => {
  const mergedDomains = mergeByUniqueKey('domain', x, y);

  // Apply custom merging for 'pages' in each domain
  return mergedDomains.map(domain => ({
      ...domain,
      pages: mergePages(domain.pages, y.find(yDomain => yDomain.domain === domain.domain)?.pages || [])
  }));
};