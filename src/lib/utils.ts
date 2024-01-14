import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(milliseconds: number) {
  let seconds: number | string = Math.floor(milliseconds / 1000);
  let minutes: number | string = Math.floor(seconds / 60);
  let hours: number | string = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  // Padding each unit to ensure two digits
  hours = hours.toString().padStart(2, '0');
  minutes = minutes.toString().padStart(2, '0');
  seconds = seconds.toString().padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}