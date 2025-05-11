import {AfterViewInit, Component, Inject, OnInit, ViewChild,} from '@angular/core';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef,} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MaterialModule} from 'src/app/material.module';
import {CommonModule} from '@angular/common';
import {TablerIconsModule} from 'angular-tabler-icons';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TaskService} from 'src/app/services/apps/ticket/task.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Task} from "../../../services/models/tasks";
import {AppAddApplicationComponent} from "../application/add/add.component";
import {Observable} from "rxjs";
import {RouterLink} from "@angular/router";
import {User} from "../../../services/models/user";
import {UserService} from "../../../services/apps/user/user.service";

@Component({
  selector: 'app-task-list',
  templateUrl: './tasks.component.html',
  imports: [MaterialModule, CommonModule, TablerIconsModule, RouterLink],
})
export class AppTasklistComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable, {static: true}) table: MatTable<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  searchText: string = '';
  totalCount = 0;
  Closed = 0;
  Inprogress = 0;
  Open = 0;

  displayedColumns: string[] = [
    'title',
    'assignee',
    'status',
    'createdBy',
    'createdAt',
    'priority',
    'action',
  ];

  dataSource = new MatTableDataSource<Task>([]);

  constructor(private taskService: TaskService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loadAllTickets(); // Load the initial tickets
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/profile/no-user.jpg';
  }


  loadAllTickets(): void {
    this.taskService.findAllTasks().subscribe((tasks) => {
      this.dataSource.data = tasks;
      this.totalCount = tasks.length;
    });
    this.updateCounts();
  }


  private updateCounts(): void {
    this.totalCount = this.dataSource.data.length;
    this.Open = this.countTicketsByStatus('open');
    this.Closed = this.countTicketsByStatus('closed');
    this.Inprogress = this.countTicketsByStatus('inprogress');
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  onKeyup(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    this.applyFilter(input.value);
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  btnCategoryClick(val: string): number {
    this.dataSource.filter = val.trim().toLowerCase();
    return this.dataSource.filteredData.length;
  }

  openDialog(action: string, task: Task | any): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      data: { action, task },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result?.event === 'Delete' || result?.event === 'Assign' || result?.event === 'Add' || result?.event === 'Refresh') {
        this.loadAllTickets();
      }
    });
  }



  countTicketsByStatus(status: string): number {
    return this.dataSource.data.filter(
      (task) => (task.status ?? '').toLowerCase() === status.toLowerCase()
    ).length;
  }

}

@Component({
  // tslint:disable-next-line - Disables all
  selector: 'app-dialog-content',
  templateUrl: 'task-dialog-content.html',
  imports: [
    MaterialModule,
    CommonModule,
    TablerIconsModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,

  ],
})
export class TaskDialogComponent {
  action: string;
  task: Task;
  users: User[] = [];
  dateControl = new FormControl();

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {
    this.action = data.action;
    this.task = {...data.task};
    console.log(this.data);
  }


  ngOnInit(): void {
    this.loadAllUsers();
    if (this.task.echeance) {
      this.dateControl.setValue(
        new Date(this.task.echeance).toISOString().split('T')[0]
      ); //  existing date
    } else {
      // Set to today's date if no existing date is available
      this.dateControl.setValue(new Date().toISOString().split('T')[0]);
    }
  }

  loadAllUsers(): void {
    this.userService.findAllNonAdminUsers().subscribe(
      (response: User[]) => {
        this.users = response; // Set the whole user list
      },
      (error) => {
        console.error("Error fetching users:", error);
      }
    );
  }

  doAction(): void {
    this.task.echeance = this.dateControl.value; // Update local_data with the new date

    if (this.action === 'Assign') {
      this.taskService.affectTaskToUser(this.task?.uuid, this.task?.porteur?.uuid).subscribe(
        () => {
          this.dialogRef.close({event: 'Assign'}); // Sends event back to parent
          this.openSnackBar('User assigned successfully!', 'Close');
        },
        (error) => {
          console.error('Error during assigning User:', error);
          this.openSnackBar('Failed to assign User!', 'Close');
        }
      );
    } else if (this.action === 'Update') {
      // this.ticketService.updateTicket(this.local_data);
      this.openSnackBar('Ticket updated successfully!', 'Close');
    } else if (this.action === 'Add') {
      this.createNewTask();
      // this.ticketService.addTicket(this.local_data);
      // this.openSnackBar('Ticket added successfully!', 'Close');
    } else if (this.action === 'Delete') {
      this.taskService.deleteTask(this.task.uuid!).subscribe(
        () => {
          this.openSnackBar('Ticket deleted successfully!', 'Close');
          this.dialogRef.close({event: 'Delete'}); // Only close after successful delete
        },
        (error) => {
          console.error('Error deleting task:', error);
          this.openSnackBar('Failed to delete task', 'Close');
        }
      );
    }
  }


  private createNewTask() {
    const email = sessionStorage.getItem('userEmail') ?? undefined;
    this.task.emailCreatedBy = email;
    this.saveTask(this.task).subscribe(
      (createdTask: Task) => {
        console.log("Task created successfully:", createdTask);
        // Close the dialog only after user creation
        // Open success dialog
        const successDialogRef = this.dialog.open(AppAddApplicationComponent);
        successDialogRef.afterClosed().subscribe(() => {
          this.dialogRef.close({event: 'Refresh'});
          this.openSnackBar('Task Added successfully!', 'Close');
        });
      },
      (error: any) => {
        console.error("Error creating Task:", error);
        this.openSnackBar('Failed to add task!', 'Close');
      }
    );
  }

  saveTask(task: Task): Observable<Task> {
    console.log(task);
    return this.taskService.addTask(task);
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  trackByUser(index: number, user: any): number {
    return user.uuid;
  }
}
