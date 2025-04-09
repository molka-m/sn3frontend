import {Group} from "./group";

export interface Application {
  applicationName?: string;
  applicationDescription?: string;
  creationDate?: string;
  uuid?: string;
  group?: Group;

}
