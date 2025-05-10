import {Group} from "./group";
import {ApplicationAssignmentDetailsResponse} from "./ApplicationAssignmentDetails";

export interface ApplicationDetailsResponse {

  group?: Group,
  applicationAssignmentDetails?: ApplicationAssignmentDetailsResponse[]
}
