export interface User {
  id: string;
  name: string;
  email: string;
  creationDate: Date;
  modifiedDate?: Date;
  username?: string;
}
