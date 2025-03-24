export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  predictionActive: boolean;
  role?: string;
}
