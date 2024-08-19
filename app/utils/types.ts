import type { Document } from "mongodb";

export type AdminInterface = {
  _id: string;
  username: string;
  email: string;
  role?: string;
  permissions?: [{ name: string; action: string }];
  createdAt: Date;
  updatedAt: Date;
};

export type EmployeeInterface = {
  _id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  username: string;
  email: string;
  role?: string;
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
