import {UserRole} from "../models/UserRole";

export interface AnalyticsModel {
  totalNumberOfNonAdminUsers?: number;
  totalNumberOfTickets?: number;
  nbrOfTicketsPerUser?: Record<string, number>;
  totalNumberOfGroups?: number;
  totalNumberOfApplications?: number;

}
