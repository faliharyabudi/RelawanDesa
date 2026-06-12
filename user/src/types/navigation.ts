import { Activity } from './activity';
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  ActivityDetail: { activity: Activity };
  AddActivity: undefined;
  Notification: undefined;
};
export type MainTabParamList = {
  Beranda: undefined;
  Riwayat: undefined;
  Profil: undefined;
};