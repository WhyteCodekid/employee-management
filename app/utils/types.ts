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

export type LeaveInterface = {
  _id: string;
  user: UserInterface;
  status: string;
  type: "sick" | "annual" | "unpaid" | undefined;
  startDate: Date;
  endDate: Date;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
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
  chekInTime: Date;
  chekOutTime: Date;
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

export type FaqInterface = {
  _id: string;
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
};
