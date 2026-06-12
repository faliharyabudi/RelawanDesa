export interface Activity {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  imageUrl?: string;
  _count?: { volunteers: number };
  category?: string;
  status?: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
}