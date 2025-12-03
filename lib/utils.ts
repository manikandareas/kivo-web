import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a UUID v4 string
 * Uses crypto.randomUUID() for secure random generation
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}
