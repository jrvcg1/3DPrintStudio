export interface AppUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  provider: 'google' | 'email' | 'password' | string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLoginAt: string;
  orderCount: number;
}
