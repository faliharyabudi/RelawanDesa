export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  _count?: { volunteers: number };
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  _count?: { volunteers: number };
}

export interface VolunteerActivity {
  id: string;
  userId: string;
  activityId: string;
  joinedAt: string;
  user: Pick<User, 'id' | 'name' | 'email' | 'createdAt'>;
  activity?: Activity;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
