import {Injectable, signal} from '@angular/core';
import {ToDo} from 'src/app/pages/apps/todo/todo';
import {HttpClient} from "@angular/common/http";
import {Task} from "../../models/tasks";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class TodoService {

  private backendUrl = 'http://localhost:8081/api/v1/todo';

  constructor(private http: HttpClient) {
    this.loadTodosForUser()
  }

  private todos = signal<ToDo[]>([]); // Start with empty array

  public getTodos(): ToDo[] {
    return this.todos();
  }

  findToDosByUser(): Observable<ToDo[]> {
    const userEmail = sessionStorage.getItem('userEmail');
    return this.http.get<ToDo[]>(`${this.backendUrl}/all/` + userEmail);
  }

  public loadTodosForUser(): void {
    this.findToDosByUser().subscribe({
      next: (todosFromBackend) => {
        this.todos.set(todosFromBackend);
      },
      error: (error) => {
        console.error('Failed to load todos', error);
      }
    });
  }

  addToDOb(newToDo: ToDo): Observable<Task> {
    return this.http.post<Task>(`${this.backendUrl}/add`, newToDo);
  }

  update(update: ToDo): Observable<Task> {
    return this.http.post<Task>(`${this.backendUrl}/update`, update);
  }


  public addTodo(message: string): void {
    if (message.trim().length === 0) {
      return;
    }

    const newTodo: ToDo = {
      uuid: '', // Backend should generate the UUID
      message,
      completionStatus: false,
      edit: false,
      date: new Date(),
      userEmail: sessionStorage.getItem('userEmail') || ''
    };

    this.addToDOb(newTodo).subscribe({
      next: () => {
        console.log(newTodo)
        this.loadTodosForUser();
      },
      error: (error) => {
        console.error('Failed to add todo', error);
      }
    });
  }

    public deleteTodo(uuid: string): void {
     // this.todos.update((todos) => todos.filter((todo) => todo.id !== id));
    }

  public editTodo(uuid: string, message: string): void {
    this.todos.update((todos) =>
      todos.map((todo) =>
        todo.uuid === uuid ? {...todo, message, edit: false} : todo
      )
    );
  }


}
