import { Injectable, signal } from '@angular/core';
import { TicketElement } from 'src/app/pages/apps/tickets/ticket';
import { tickets } from 'src/app/pages/apps/tickets/ticketsData';
import {Observable} from "rxjs";
import {Group} from "../../models/group";
import {Task} from "../../models/tasks";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  //  track ticket data
  private ticketsData = signal<TicketElement[]>(tickets);
  private backendUrl = 'http://localhost:8081/api/v1/task';

  get tickets$() {
    return this.ticketsData();
  }

  public users = [
    { id: 1, name: 'Alice', photo: '/assets/images/profile/user-1.jpg' },
    { id: 2, name: 'Jonathan', photo: '/assets/images/profile/user-2.jpg' },
    { id: 3, name: 'Smith', photo: '/assets/images/profile/user-3.jpg' },
    { id: 4, name: 'Vincent', photo: '/assets/images/profile/user-4.jpg' },
    { id: 5, name: 'Chris', photo: '/assets/images/profile/user-5.jpg' },
  ];

  getUsers(): any[] {
    return this.users;
  }

  constructor(private http: HttpClient) { }

  addTicket(ticket: TicketElement): void {
    const today = new Date();

    // Get the current list of tickets
    const currentTickets = this.ticketsData();

    // Find the highest ID currently in use
    const maxId =
      currentTickets.length > 0
        ? Math.max(...currentTickets.map((t) => t.id))
        : 0; // Default to 0 if no tickets exist

    const newTicket: TicketElement = {
      id: maxId + 1, // Set new ID
      title: ticket.title,
      subtext: ticket.subtext,
      assignee: ticket.assignee,
      imgSrc: '/assets/images/profile/user-1.jpg',
      status: 'open',
      date: today.toISOString().split('T')[0],
    };

    // Update the tickets data with the new ticket
    this.ticketsData.update((currentTickets) => [...currentTickets, newTicket]);
  }

  updateTicket(updatedTicket: TicketElement): void {
    this.ticketsData.update((currentTickets) =>
      currentTickets.map((ticket) =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );
  }

  deleteTicket(id: number): void {
    this.ticketsData.update((currentTickets) =>
      currentTickets.filter((ticket) => ticket.id !== id)
    );
  }


  // coming from backend
  findAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.backendUrl}/all`);
  }


  addTask(newTask: Task): Observable<Task> {
    return this.http.post<Task>(`${this.backendUrl}/add`, newTask);
  }

  deleteTask(uuid: string): Observable<any> {
    return this.http.delete<any>(`${this.backendUrl}/delete/` + uuid);
  }

  affectTaskToUser(uuidTask: string | undefined, uuidUser: string | undefined): Observable<any> {
    return this.http.post<any>(`${this.backendUrl}/assing/` + uuidTask + `/` + uuidUser, null);
  }

  removeTaskFromUser(uuidTask: string | undefined, uuidUser: string | undefined): Observable<any> {
    return this.http.post<any>(`${this.backendUrl}/removeuser/` + uuidTask + `/` + uuidUser, null);
  }

}
