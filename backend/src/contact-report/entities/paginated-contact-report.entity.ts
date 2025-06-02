import { ContactReport } from "@prisma/client";

export class PaginatedContactReportsDto {
  results: ContactReport[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
  };
}