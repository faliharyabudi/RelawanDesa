export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
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
  activity: Activity;
}
