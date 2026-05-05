import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD') // Remove acentos
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-') // Espaços por -
    .replace(/[^\w-]+/g, '') // Remove caracteres especiais
    .replace(/--+/g, '-'); // Remove hifens duplos
}
