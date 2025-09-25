export class AuthResponseDto {
  access_token: string;
  user: {
    gymId: string;
    name: string;
    role: string;
    membershipType: string;
    joinDate: string;
  };
}
