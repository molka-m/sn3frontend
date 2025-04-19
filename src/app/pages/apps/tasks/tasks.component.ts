import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Inject,
} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from 'src/app/services/apps/ticket/task.service';
import { TicketElement } from 'src/app/pages/apps/tasks/ticket';
import { MatSnackBar } from '@angular/material/snack-bar';
import {provideNativeDateAdapter} from "@angular/material/core";
import {Task} from "../../../services/models/tasks";
import {Application} from "../../../services/models/application";
import {AppAddApplicationComponent} from "../application/add/add.component";
import {Observable} from "rxjs";
import {TasksService} from "../tasksssss/tasks-service.service";

@Component({
  selector: 'app-task-list',
  templateUrl: './tasks.component.html',
  imports: [MaterialModule, CommonModule, TablerIconsModule],
})
export class AppTasklistComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  searchText: string = '';
  totalCount = 0;
  Closed = 0;
  Inprogress = 0;
  Open = 0;

  displayedColumns: string[] = [
    'id',
    'title',
    'assignee',
    'status',
    'date',
    'action',
  ];

  dataSource = new MatTableDataSource<TicketElement>([]);

  constructor(private ticketService: TaskService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadTickets(); // Load the initial tickets
  }

  private loadTickets(): void {
    const tickets = this.ticketService.tickets$; // Get tickets from the service
    this.dataSource.data = tickets; // Set the dataSource to the tickets

    // Update counts based on the current tickets
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

    dialogRef.afterClosed().subscribe(() => {
      this.loadTickets();
    });
  }

  countTicketsByStatus(status: string): number {
    return this.dataSource.data.filter(
      (ticket) => ticket.status.toLowerCase() === status.toLowerCase()
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
  users: any[] = [];
  dateControl = new FormControl();

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {
    this.action = data.action;
    this.task = { ...data.task };
    console.log(this.data);
  }

  ngOnInit(): void {
    this.users = this.taskService.getUsers(); // Get users from the service

    if (this.task.echeance) {
      this.dateControl.setValue(
        new Date(this.task.echeance).toISOString().split('T')[0]
      ); //  existing date
    } else {
      // Set to today's date if no existing date is available
      this.dateControl.setValue(new Date().toISOString().split('T')[0]);
    }
  }

  doAction(): void {
    this.task.echeance = this.dateControl.value; // Update local_data with the new date

    if (this.action === 'Update') {
     // this.ticketService.updateTicket(this.local_data);
      this.openSnackBar('Ticket updated successfully!', 'Close');
    } else if (this.action === 'Add') {
      this.createNewTask();
      // this.ticketService.addTicket(this.local_data);
     // this.openSnackBar('Ticket added successfully!', 'Close');
    } else if (this.action === 'Delete') {
   //   this.ticketService.deleteTicket(this.local_data.id);
      this.openSnackBar('Ticket deleted successfully!', 'Close');
    }
    this.dialogRef.close();
  }

  private createNewTask() {
    const email = sessionStorage.getItem('userEmail') ?? undefined;
    this.task.emailCreatedBy = email;
    this.saveTask(this.task).subscribe(
      (createdTask: Task) => {
        console.log("Task created successfully:", createdTask);
        // Close the dialog only after user creation
        this.dialogRef.close();
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
    return user.id;
  }
}
