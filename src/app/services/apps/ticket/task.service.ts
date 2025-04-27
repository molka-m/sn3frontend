import {Injectable, signal} from '@angular/core';
import {Observable} from "rxjs";
import {Task} from "../../models/tasks";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  //  track ticket data
  private backendUrl = 'http://localhost:8081/api/v1/task';


  public users = [
    {id: 1, name: 'Alice', photo: '/assets/images/profile/user-1.jpg'},
    {id: 2, name: 'Jonathan', photo: '/assets/images/profile/user-2.jpg'},
    {id: 3, name: 'Smith', photo: '/assets/images/profile/user-3.jpg'},
    {id: 4, name: 'Vincent', photo: '/assets/images/profile/user-4.jpg'},
    {id: 5, name: 'Chris', photo: '/assets/images/profile/user-5.jpg'},
  ];

  getUsers(): any[] {
    return this.users;
  }

  constructor(private http: HttpClient) {
  }


  todos = signal<Task[]>([]);
  inProgress = signal<Task[]>([]);
  completed = signal<Task[]>([]);
  onHold = signal<Task[]>([]);


  getAllTasks(): Observable<{
    todos: Task[];
    inProgress: Task[];
    completed: Task[];
    onHold: Task[];
  }> {
    return this.findAllTasksByUser().pipe(
      map((tasks: Task[]) => {
        console.log(tasks);
        const todos = tasks.filter(task => task.status === 'TODO');
        const inProgress = tasks.filter(task => task.status === 'En_Cours');
        const completed = tasks.filter(task => task.status === 'Termine');
        const onHold = tasks.filter(task => task.status === 'En_Attente');

        // Set the signals
        this.todos.set(todos);
        this.inProgress.set(inProgress);
        this.completed.set(completed);
        this.onHold.set(onHold);

        // Return the grouped tasks
        return {todos, inProgress, completed, onHold};
      })
    );
  }


  /* addTaskKanban(task: Todos): void {
     const currentTodos = this.todos();
     const newTask = {
       ...task,
       id: currentTodos.length
         ? currentTodos[currentTodos.length - 1].id + 1
         : 1, // Generate a new ID
     };
     this.todos.set([...currentTodos, newTask]);
   }

   editTask(updatedTask: Todos): void {
     const currentTodos = this.todos();
     const updatedTodos = currentTodos.map((task: { id: number }) =>
       task.id === updatedTask.id ? updatedTask : task
     );
     this.todos.set(updatedTodos);

     this.updateTaskInList(this.inProgress(), updatedTask);
     this.updateTaskInList(this.completed(), updatedTask);
     this.updateTaskInList(this.onHold(), updatedTask);
   }

   private updateTaskInList(taskList: Todos[], updatedTask: Todos): void {
     const updatedList = taskList.map((task) =>
       task.id === updatedTask.id ? updatedTask : task
     );
     if (taskList === this.inProgress()) {
       this.inProgress.set(updatedList);
     } else if (taskList === this.completed()) {
       this.completed.set(updatedList);
     } else if (taskList === this.onHold()) {
       this.onHold.set(updatedList);
     }
   }

   deleteTaskKanban(taskId: number): void {
     this.todos.set(
       this.todos().filter((task: { id: number }) => task.id !== taskId)
     );
     this.inProgress.set(
       this.inProgress().filter((task: { id: number }) => task.id !== taskId)
     );
     this.completed.set(
       this.completed().filter((task: { id: number }) => task.id !== taskId)
     );
     this.onHold.set(
       this.onHold().filter((task: { id: number }) => task.id !== taskId)
     );
   }
 */

  // coming from backend
  findAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.backendUrl}/all`);
  }


  findAllTasksByUser(): Observable<Task[]> {
    const userEmail = sessionStorage.getItem('userEmail');
    console.log(userEmail);
    return this.http.get<Task[]>(`${this.backendUrl}/all/`+userEmail);
  }



  findTaskByUuid(uuid: string | undefined): Observable<Task> {
    return this.http.get<Task>(`${this.backendUrl}/` + uuid);
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

  saveAll(uuids: (Task | undefined)[]):Observable<any> {
    return this.http.post<any>(`${this.backendUrl}/saveAll`, uuids);
  }

}
