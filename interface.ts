export interface BookItem {
  _id: string;
  title: string;
  author: string;
  ISBN: string;
  publisher: string;
  availableAmount: number;
  coverPicture: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

export interface BookJson {
  success: boolean;
  count: number;
  pagination?: object;
  data: BookItem[];
}

export interface ReservationItem {
  _id?: string;
  borrowDate: string;
  pickupDate: string;
  book: string;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
}
