import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBusinessTypeColor(businessType: string): string {
  const type = businessType.toLowerCase();
  if (type === 'pub') {
    return 'text-trans-blue';
  } else if (type === 'restaurant') {
    return 'text-trans-pink';
  } else {
    return 'text-brand-navy';
  }
}

export function getBusinessTypeHexColor(businessType: string): string {
  const type = businessType.toLowerCase();
  if (type === 'pub') {
    return '#60a5fa'; // trans-blue
  } else if (type === 'restaurant') {
    return '#f472b6'; // trans-pink
  } else {
    return '#374151'; // brand-navy
  }
}
