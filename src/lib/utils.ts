import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBusinessTypeColor(businessType: string): string {
  const type = businessType.toLowerCase();
  switch (type) {
    case 'pub':
      return 'text-trans-blue';
    case 'restaurant':
      return 'text-trans-pink';
    case 'shop':
      return 'text-emerald-600';
    case 'gym':
      return 'text-orange-600';
    case 'cinema':
      return 'text-purple-600';
    case 'office':
      return 'text-red-800';
    default:
      return 'text-brand-navy';
  }
}

export function getBusinessTypeHexColor(businessType: string): string {
  const type = businessType.toLowerCase();
  switch (type) {
    case 'pub':
      return '#60a5fa'; // trans-blue
    case 'restaurant':
      return '#f472b6'; // trans-pink
    case 'shop':
      return '#059669'; // emerald-600
    case 'gym':
      return '#ea580c'; // orange-600
    case 'cinema':
      return '#9333ea'; // purple-600
    case 'office':
      return '#991b1b'; // red-800
    default:
      return '#374151'; // brand-navy
  }
}
