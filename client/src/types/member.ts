export type Member = {
  id: string
  displayName: string
  gender: string
  city: string
  country: string
  dateOfBirth: string
  created: string
  lastActive: string
  imageUrl?: string
  description?: string
}

export class MemberParams  {
  gender?: string;
  minAge: number = 18;
  maxAge: number = 100;
  pageNumber: number = 1;
  pageSize: number = 10;
  orderBy: string = 'lastActive';
}