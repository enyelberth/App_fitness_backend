export class UserResponseDto {
  id: string;
  email: string;
  username: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    avatarUrl?: string;
  };
  createdAt: Date;
}
