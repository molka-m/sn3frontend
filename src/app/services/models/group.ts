import {Application} from "./application";
import {Category} from "../../pages/apps/group-list/listing/categories";

export interface Group {
  groupName?: string;
  uuid?: string;
  creationDate?: Date;
  color? : string;
  applications?: Application[];
}


export const filter = [
  {
    id: 1,
    name: 'All',
    icon: 'mail',
    count: 0,
    active: true,
  },
  {
    id: 2,
    name: 'Frequent',
    icon: 'send',
    count: 0,
    active: false,
  },
  {
    id: 3,
    name: 'Starred',
    icon: 'note',
    count: 0,
    active: false,
  },
];

