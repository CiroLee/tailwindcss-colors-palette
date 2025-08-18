import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...classnames: ClassValue[]): string {
  return twMerge(clsx(classnames));
}

export function copyToClipboard(text: string) {
  return navigator.clipboard.writeText(text);
}
