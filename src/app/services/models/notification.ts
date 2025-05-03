import {User} from "./user";

export interface Notification {
  id: number;
  title: string;
  message: string;
  uuid: string;
  type: string;
  createdAt: string; // ISO date string
  actor?: User; // Optional: who triggered it
  relatedEntityId?: string;
}
