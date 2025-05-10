import {AfterViewInit, Component, Inject, OnInit, Optional, ViewChild,} from '@angular/core';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef,} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {AppAddApplicationComponent} from './add/add.component';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'src/app/material.module';
import {TablerIconsModule} from 'angular-tabler-icons';
import {EmployeeService} from 'src/app/services/apps/employee/employee.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {User} from "../../../services/models/user";
import {forkJoin, Observable} from "rxjs";
import {Application} from "../../../services/models/application";
import {ApplicationService} from "../../../services/apps/application/application.service";
import {Group} from "../../../services/models/group";
import {GroupService} from "../../../services/apps/Group/group.service";
import {UserService} from "../../../services/apps/user/user.service";

@Component({
  selector: 'app-user',
  templateUrl: './application.component.html',
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    CommonModule,
  ],
  standalone: true
})
export class AppApplicationComponent implements AfterViewInit, OnInit {
  @ViewChild(MatTable, {static: true}) table: MatTable<any> =
    Object.create(null);

  searchText: any;
  isIngenieur: boolean = false;


  displayedColumns: string[] = [
    'name',
    'Description',
    'CreationDate',
    'Group',
    'action',
  ];

  dataSource = new MatTableDataSource<User>([]);
  applications: Application[] = [];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator =
    Object.create(null);

  constructor(
    public dialog: MatDialog,
    private employeeService: EmployeeService,
    private applicationService: ApplicationService,
  ) {
  }

  ngOnInit(): void {
    this.loadAllApplication();
    const userRole = sessionStorage.getItem('userRole') ?? '';
    if (userRole === 'INGENIEUR') {
      this.isIngenieur = true
    }
  }

  loadAllApplication(): void {
    this.applicationService.findAllApp().subscribe(
      (response: Application[]) => {
        this.applications = response;
        this.dataSource.data = this.applications; // ✅ Correct way to update MatTableDataSource
        this.dataSource = new MatTableDataSource(this.applications); // ✅ Ensuring table update
      },
      (error) => {
        console.error("Error fetching users:", error);
      }
    );
  }


  /*  async getUserByEmail(userEmail: string): Promise<void> {

      this.userService.getUserByEmail(userEmail).subscribe(
        (response: User) => {
          this.user = response;
          sessionStorage.setItem('userRole', response.role?.toString() ?? '');
          sessionStorage.setItem('userEmail', userEmail);
        },
        (error) => {
          console.error('restoring module error', error);
        }
      );
    }*/

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, application: Application | any): void {
    console.log(this.applications)
    console.log(application)
    const dialogRef = this.dialog.open(AppApplicationDialogContentComponent, { width : '700px',
      data: {action, application}, autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadAllApplication()
      this.dataSource.data = this.applications;
      if (result && result.event === 'Refresh') {
        this.loadAllApplication(); // Refresh the employee list if necessary
      }
    });
  }
}

interface DialogData {
  action: string;
  application: Application;
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TablerIconsModule,
  ],
  templateUrl: 'application-dialog-content.html',
  standalone: true
})
// tslint:disable-next-line: component-class-suffix
export class AppApplicationDialogContentComponent {
  action: string | any;
  // tslint:disable-next-line - Disables all
  application: Application;
  selectedImage: any = '';
  groupes: Group[] = [];
  users: User[] = [];
  selectGroup: Group;
  selectedUsers: User[];
  uuidsToRemove: string[] =[];
  bandwidthOptions: string[] = ['1/5', '2/5', '3/5', '4/5', '5/5'];
  userBandwidths: { [uuid: string]: string } = {};
  joiningDate = new FormControl();

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AppApplicationDialogContentComponent>,
    private snackBar: MatSnackBar,
    private applicationService: ApplicationService,
    private groupService: GroupService,
    private userService: UserService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.action = data.action;
    this.application = {...data.application};
    console.log(this.application)
    this.loadAllGroups();
    this.loadApplicationAssignmentDetails(this.application.uuid);

  }

  getAvailableBandwidthOptions(user: User): string[] {
    const mapping = {
      '1/5': 20,
      '2/5': 40,
      '3/5': 60,
      '4/5': 80,
      '5/5': 100,
    };

    return this.bandwidthOptions.filter(option => {
      const required = mapping[option as keyof typeof mapping];
      return user.remainingBandWidth! >= required;
    });
  }


  doAction(): void {
    if (this.action === 'Add') {
      console.log(this.application)
      this.saveApplication(this.application).subscribe(
        (createdApp: Application) => {
          console.log("Application created successfully:", createdApp);
          // Close the dialog only after user creation
          this.dialogRef.close();
          // Open success dialog
          const successDialogRef = this.dialog.open(AppAddApplicationComponent);
          successDialogRef.afterClosed().subscribe(() => {
            this.dialogRef.close({event: 'Refresh'});
            this.openSnackBar('Application Added successfully!', 'Close');
          });
        },
        (error: any) => {
          console.error("Error creating Applicationn:", error);
          this.openSnackBar('Failed to add application!', 'Close');
        }
      );

    } else if (this.action === 'Assign' && this.application.applicationName && this.selectGroup.uuid) {
      const userApplicationAssignmentRequest = {
        userAssignmentDetails: this.selectedUsers.map(user => {
          const uuid = user.uuid;

          // Ensure uuid is defined and a string
          if (uuid === undefined) {
            // Handle the case where uuid is undefined, perhaps by skipping or assigning a default value.
            return {
              uuidUser: uuid,
              userBandWidth: 0
            };
          }

          const userBandWidth = this.userBandwidths[uuid]
            ? (parseInt(this.userBandwidths[uuid].split('/')[0], 10) / 5) * 100
            : 0;

          return {
            uuidUser: uuid,
            userBandWidth
          };
        })
      };


      this.applicationService.affectGroupToApplication(this.application.applicationName, this.selectGroup.uuid,userApplicationAssignmentRequest).subscribe(
        () => {
          // Only close the dialog and show the snackbar after deletion succeeds
          this.dialogRef.close({event: 'Assign'});
          this.openSnackBar('Group And Users assigned successfully!', 'Close');
        },
        (error) => {
          console.error('Error during assigning group:', error);
          this.openSnackBar('Failed to assing group !', 'Close');
        }
      );

    } else if (this.action === 'Delete' && this.application.applicationName) {
      this.applicationService.deleteApplication(this.application.applicationName).subscribe(
        () => {
          // Only close the dialog and show the snackbar after deletion succeeds
          this.dialogRef.close({event: 'Delete'});
          this.openSnackBar('Application Deleted successfully!', 'Close');
        },
        (error) => {
          console.error('Error deleting Application:', error);
          this.openSnackBar('Failed to delete Application!', 'Close');
        }
      );
    }
  }

  loadAllGroups(): void {
    this.groupService.findAllGroups().subscribe(
      (response: Group[]) => {
        this.groupes = response;
      },
      (error) => {
        console.error("Error fetching Group:", error);
      }
    );
  }


  saveApplication(application: Application): Observable<Application> {
    return this.applicationService.addApplication(application);
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  closeDialog(): void {
    this.dialogRef.close({event: 'Cancel'});
  }

  getUserBandwidth(uuid: string | undefined): string {
    return uuid ? this.userBandwidths[uuid] || '' : '';
  }

  setUserBandwidth(uuid: string | undefined, value: string): void {
    if (uuid) {
      this.userBandwidths[uuid] = value;
    }
  }


  onGroupChange(selectGroup: Group) {

    this.userService.findByGroupUUIDAndNotAssinged(this.application.uuid,selectGroup.uuid).subscribe(users => {
      this.users = users;
    });
    this.selectedUsers = [];
    this.userBandwidths = {};
  }

  private loadApplicationAssignmentDetails(uuid: string | undefined): void {
    this.applicationService.getApplicationDetails(uuid).subscribe(response => {
      this.selectGroup = response.group;
      this.users = response.applicationAssignmentDetails.map((d: { userDto: any; }) => d.userDto);

      // Must assign after `this.users` is set
      this.selectedUsers = response.applicationAssignmentDetails.map((d: { userDto: any; }) => d.userDto);
      console.log(this.selectedUsers);

      this.userBandwidths = {};
      response.applicationAssignmentDetails.forEach((detail: { userBandWidth: number; userDto: { uuid: string | number; }; }) => {
        const fraction = detail.userBandWidth / 20;
        this.userBandwidths[detail.userDto.uuid] = `${fraction}/5`;
      });
    });

  }
  removeUser(index: number): void {
    const user = this.selectedUsers[index];
    if (user && user.uuid) {
      this.uuidsToRemove.push(user.uuid);
      delete this.userBandwidths[user.uuid];
    }

    // Instead of splice (which mutates the array), use filter for better change detection
    this.selectedUsers = this.selectedUsers.filter((_, i) => i !== index);
    this.applicationService.removeUsersFromApplication(this.application.uuid,this.uuidsToRemove).subscribe(value=>{
    console.log("user Removed successfully!");

    });
  }





  compareUsers = (a: User, b: User): boolean => a?.uuid === b?.uuid;
  compareGroups = (a: Group, b: Group): boolean => a?.uuid === b?.uuid;


}
