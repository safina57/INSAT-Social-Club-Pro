import { Category, Status } from '@prisma/client';

export class ContactReport {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  category: Category;
  message: string;
  status: Status
  createdAt: Date;
}

