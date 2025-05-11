import {Component, OnInit, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup,} from '@angular/forms';
import {ToDo} from './todo';
import {TodoService} from 'src/app/services/apps/todo/todo.service';
import {MaterialModule} from 'src/app/material.module';
import {CommonModule} from '@angular/common';
import {TablerIconsModule} from 'angular-tabler-icons';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {AppDeleteDialogComponent} from '../kanban/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  imports: [
    MaterialModule,
    CommonModule,
    TablerIconsModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})

export class AppTodoComponent implements OnInit {
  sidePanelOpened = signal<boolean>(true);
  public showSidebar = signal<boolean>(false);
  inputFg: UntypedFormGroup;
  selectedCategory = signal<string>('all');
  todos = signal<ToDo[]>([]);
  searchText = signal<string | null>(null);
  editSave = signal<string>('Edit');

  totalTodos = signal<number>(0);
  totalCompleted = signal<number>(0);
  totalIncomplete = signal<number>(0);

  constructor(
    public fb: UntypedFormBuilder,
    public snackBar: MatSnackBar,
    public todoService: TodoService,
    private dialog: MatDialog
  ) {
  }

  isOver(): boolean {
    return window.matchMedia(`(max-width: 960px)`).matches;
  }

  mobileSidebar(): void {
    this.showSidebar.set(!this.showSidebar);
  }


  public loadTodosForUser(): void {
    this.todoService.findToDosByUser().subscribe({
      next: (todosFromBackend) => {
        this.todos.set(todosFromBackend);
        this.calculateTotals(todosFromBackend);  // Calculate totals after loading todos
      },
      error: (error) => {
        console.error('Failed to load todos', error);
        // If there is an error, initialize the totals to 0
        this.calculateTotals([]);
      }
    });
  }

  private calculateTotals(todos: ToDo[]): void {
    this.totalTodos.set(todos.length);
    this.totalCompleted.set(todos.filter((todo) => todo.completionStatus).length);
    this.totalIncomplete.set(todos.filter((todo) => !todo.completionStatus).length);
    console.log(todos)
  }

  ngOnInit(): void {
    this.loadTodosForUser();
    // Initialize the form group
    this.inputFg = this.fb.group({
      mess: [],
    });
  }


  selectionlblClick(val: string): void {
    this.selectedCategory.set(val); // Update the selected category

    this.todoService.findToDosByUser().subscribe({
      next: (todosFromBackend) => {
        const filteredTodos = todosFromBackend.filter((todo) => {
          if (val === 'all') return true;
          if (val === 'complete') return todo.completionStatus;
          if (val === 'uncomplete') return !todo.completionStatus;
          return true;
        });

        this.todos.set(filteredTodos); // Update displayed todos
        this.calculateTotals(todosFromBackend); // Update totals based on filtered data
      },
      error: (error) => {
        console.error('Failed to load todos', error);
        this.todos.set([]); // Clear todos on error
        this.calculateTotals([]); // Reset totals
      }
    });
  }


  // Filter todos based on the selected category
// Update the todos signal with filtered results


  addTodo(): void {
    const message = this.inputFg.get('mess')?.value;
    if (message) {
      this.inputFg.reset(); // Reset early for better UX

      const newTodo: ToDo = {
        uuid: '',
        message,
        completionStatus: false,
        edit: false,
        date: new Date(),
        userEmail: sessionStorage.getItem('userEmail') || ''
      };

      this.todoService.addToDOb(newTodo).subscribe({
        next: () => {
          this.todoService.findToDosByUser().subscribe({
            next: (todosFromBackend) => {
              this.todos.set(todosFromBackend);
              this.calculateTotals(todosFromBackend);
              this.openSnackBar('Todo successfully added!', 'Close');
            },
            error: (err) => {
              console.error('Failed to reload todos after adding', err);
              this.openSnackBar('Failed to refresh todo list', 'Close');
            }
          });
        },
        error: (error) => {
          console.error('Failed to add todo', error);
          this.openSnackBar('Failed to add todo', 'Close');
        }
      });
    }
  }


  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  allTodos(): void {
    const completionStatus = (<HTMLInputElement>event!.target).checked;
    this.todos.update((todos) =>
      todos.map((todo) => ({...todo, completionStatus}))
    );
    this.updateCounts();
  }

  toggleTodoCompletion(todo: ToDo): void {
    // Toggle the completion status directly
    todo.completionStatus = !todo.completionStatus;
    // Update the counts
    this.todoService.update(todo).subscribe({
      next: () => {
        this.loadTodosForUser();
      },
      error: (error) => {
        console.error('Failed to add todo', error);
      }
    });
    this.updateCounts();
  }

  private updateCounts(): void {
    const allTodos = this.todos();
    this.totalTodos.set(allTodos.length);
    this.totalCompleted.set(
      allTodos.filter((todo) => todo.completionStatus).length
    );
    this.totalIncomplete.set(
      allTodos.filter((todo) => !todo.completionStatus).length
    );
  }

  editTodo(todo: ToDo): void {
    if (todo.edit) {
      this.todoService.editTodo(todo.uuid, todo.message);
      todo.edit = false;
      this.openSnackBar('Todo successfully edited!', 'Close');
      this.updateCounts();
    } else {
      todo.edit = true;
    }
  }

  deleteTodo(uuid: string): void {
    const dialogRef = this.dialog.open(AppDeleteDialogComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.todoService.deleteTodo(uuid).subscribe(() => {
          this.selectionlblClick('all');
          this.updateCounts();
          this.openSnackBar('Todo successfully deleted!', 'Close');
        });
      }
    });
  }

  remainingList(): number {
    return this.todos().filter((todo) => !todo.completionStatus).length;
  }
}
