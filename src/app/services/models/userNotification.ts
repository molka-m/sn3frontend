import {User} from "./user";
import {Notification} from "./notification";

export interface UserNotification {
  id: number;
  isRead: boolean;
  user: User;
  notification: Notification;
}
