import {User} from "./user";

export interface Task {
  taskName?: string;
  taskDescription?: string;
  porteur?: User;
  status?: string;
  uuid?: string;
  createdBy: User;
  priority: string;
  echeance?: number;
  createdAt?: Date;
  lastModifiedAt?: Date;
}
