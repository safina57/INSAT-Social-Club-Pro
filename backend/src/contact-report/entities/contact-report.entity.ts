import { Category } from '@prisma/client';

export class ContactReport {
  id: number;
  fullName: string;
  email: string;
  subject: string;
  category: Category;
  message: string;
  createdAt: Date;
}