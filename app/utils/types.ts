export type UserInterface = {
  _id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  username: string;
  email: string;
  role?: string;
  phone: string;
  password: string;
  permissions?: [{ name: string; action: string }];
  createdAt: Date;
  updatedAt: Date;
};

export type EmailHistoryInterface = {
  _id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  storeName: string;
};

export type SettingsInterface = {
  _id: string;
  address: string;
  businessName: string;
  phine: string;
  email: string;
  separateStocks: boolean;
  allowInscription: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AttendanceInterface = {
  _id: string;
  user: UserInterface;
  createdAt: Date;
  updatedAt: Date;
};

export type FaceInterface = {
  _id: string;
  user: UserInterface;
  image: string;
  descriptor: number[];
  createdAt: Date;
  updatedAt: Date;
};
