import {Component} from '@angular/core';
import {CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem,} from '@angular/cdk/drag-drop';
import {MatDialog} from '@angular/material/dialog';
import {AppDeleteDialogComponent} from './delete-dialog/delete-dialog.component';
import {MaterialModule} from 'src/app/material.module';
import {CommonModule} from '@angular/common';
import {TablerIconsModule} from 'angular-tabler-icons';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {TaskService} from "../../../services/apps/ticket/task.service";
import {Task} from "../../../services/models/tasks";
import {RouterLink} from "@angular/router";
import {AppOkDialogComponent} from "./ok-dialog/ok-dialog.component";

// tslint:disable-next-line - Disables all

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  imports: [
    MaterialModule,
    CommonModule,
    TablerIconsModule,
    DragDropModule,
    NgScrollbarModule,
    RouterLink,
  ]
})
export class AppKanbanComponent {
  todos: Task[] = [];
  inprogress: Task[] = [];
  completed: Task[] = [];
  onhold: Task[] = [];

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private taskService: TaskService,
  ) {
    this.loadTasks();
  }




  loadTasks(): void {
    this.taskService.getAllTasks().subscribe(allTasks => {
      this.todos = allTasks.todos;
      this.inprogress = allTasks.inProgress;
      this.completed = allTasks.completed;
      this.onhold = allTasks.onHold;
    });
  }


  drop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.updateTaskStatus(this.todos, 'TODO');
    this.updateTaskStatus(this.inprogress, 'En_Cours');
    this.updateTaskStatus(this.completed, 'Termine');
    this.updateTaskStatus(this.onhold, 'En_Attente');  // Change status of all 'onhold' tasks

  }

  openDialog(action: string, obj: any): void {
    // Update the status of all tasks before collecting UUIDs

    // Log the tasks after the status update to confirm changes


    console.log(this.todos)
    // Only proceed to the saving if the action is 'Save'
    if (action === 'Save') {
      // Collect all UUIDs from each category
      const allTasks = [
        ...this.todos,
        ...this.inprogress,
        ...this.completed,
        ...this.onhold
      ];

      // Call the saveAll method to save the tasks
      this.taskService.saveAll(allTasks).subscribe({
        next: () => {
          this.loadTasks();  // Reload tasks after saving
          this.dialog.open(AppOkDialogComponent);  // Open a success dialog
          this.showSnackbar('Tasks saved successfully!');  // Show a success message
        },
        error: (err) => {
          this.showSnackbar('Error saving tasks.');
          console.error(err);
        }
      });
    }
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/profile/no-user.jpg';
  }

// Helper method to update the status of tasks
  updateTaskStatus(tasks: any[], status: string): void {
    tasks.forEach(task => {
      task.status = status;  // Update the task status
    });
  }


  showSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  //taskProperty bgcolor
  getTaskClass(taskProperty: string | any): any {
    return taskProperty === 'SUPER_LOW'
      ? 'bg-success'  // Green for SUPER_LOW
      : taskProperty === 'LOW'
        ? 'bg-primary'  // Blue for LOW
        : taskProperty === 'MEDIUM'
          ? 'bg-warning'  // Yellow for MEDIUM
          : taskProperty === 'HIGH'
            ? 'bg-danger'  // Strong Red for HIGH
            : taskProperty === 'URGENT'
              ? 'bg-dark-red'  // Darker Red for URGENT
              : '';
  }
}
