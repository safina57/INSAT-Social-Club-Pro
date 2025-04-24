export class RegisterResponseDto {
  message: string;
  data: {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
