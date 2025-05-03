// src/app/services/notification.service.ts
import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private stompClient: Client;
  private notificationSubject = new Subject<any>();

  constructor() {
    this.stompClient = new Client({
      brokerURL: 'ws://localhost:8081/ws',
      webSocketFactory: () => new SockJS('http://localhost:8081/ws'),
      reconnectDelay: 5000,
      debug: str => console.log(str),
    });

    this.stompClient.onConnect = () => {
      this.stompClient.subscribe('/topic/notifications', (message: Message) => {
        console.log(message.body)
        this.notificationSubject.next(JSON.parse(message.body));
      });
    };

    this.stompClient.activate();
  }

  getNotifications(): Observable<any> {
    return this.notificationSubject.asObservable();
  }
}
