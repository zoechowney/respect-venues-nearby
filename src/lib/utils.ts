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
      return '#5bd4d9'; // trans-blue: hsl(197 100% 75%)
    case 'restaurant':
      return '#ff9fb8'; // trans-pink: hsl(340 100% 85%)
    case 'shop':
      return '#059669'; // emerald-600
    case 'gym':
      return '#ea580c'; // orange-600
    case 'cinema':
      return '#9333ea'; // purple-600
    case 'office':
      return '#991b1b'; // red-800
    default:
      return '#2d3748'; // brand-navy: hsl(220 30% 25%)
  }
}
