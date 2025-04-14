import {Component, computed} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MaterialModule} from 'src/app/material.module';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TablerIconsModule} from 'angular-tabler-icons';
import {User} from "../../../../services/models/user";
import {UserService} from "../../../../services/apps/user/user.service";
import {GroupService} from "../../../../services/apps/Group/group.service";
import {Group} from "../../../../services/models/group";
import {GroupDisplayService} from "../../../../services/apps/group-list/group-display.service";
import {BehaviorSubject, of} from "rxjs";
import {switchMap} from "rxjs/operators";

@Component({
  selector: 'app-group-form-dialog',
  templateUrl: './group-form-dialog.component.html',
  imports: [MaterialModule, CommonModule, FormsModule, TablerIconsModule],
})
export class GroupFormDialogComponent {

  private refresh$ = new BehaviorSubject<void>(undefined);
  users: User[];
  selectedUser: User;
  listUuid: string[] = [];
  groups: Group[];
  selectedGroup: Group;

  defaultImageUrl = 'assets/images/profile/user-4.jpg';
  imageUrl: string | ArrayBuffer | null = this.defaultImageUrl;

  constructor(
    public dialogRef: MatDialogRef<GroupFormDialogComponent>,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private groupService: GroupService,
    private groupDisplayService: GroupDisplayService,
  ) {
    this.loadAllGroups();
  }

  assignUserToGroup(): void {
    if (this.selectedUser.uuid != null) {
      this.listUuid.push(this.selectedUser.uuid);
    }

    this.groupService
      .affectMultiUserToGroup(this.selectedGroup.groupName, this.listUuid)
      .subscribe(() => {
        this.listUuid = [];

        this.dialogRef.close();
        this.openSnackBar('User assigned successfully!', 'Close');

        this.groupDisplayService.applyLabel(this.selectedGroup);

        // Trigger refresh!
        this.refresh$.next();
      });
  }

  filteredCollaborateur = computed(() => {
    const selectedGroup = this.groupDisplayService.selectedLabel();
    if (selectedGroup !== null) {
      return this.refresh$.pipe(
        switchMap(() => this.userService.findByGroupUUID(selectedGroup.uuid))
      );
    }
    return of([]);
  });


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  isFormValid(): any {
    return (
      this.selectedUser && this.selectedGroup
    );

  }


  loadAllUsers(): void {
    console.log(this.selectedGroup);
    this.userService.findAllUserNonAssingedToGroup(this.selectedGroup.uuid).subscribe(
      (response: User[]) => {
        this.users = response;
      },
      (error) => {
        console.error("Error fetching users:", error);
      }
    );
  }

  loadAllGroups(): void {
    this.groupService.findAllGroups().subscribe(
      (response: Group[]) => {
        this.groups = response;
      },
      (error: any) => {
        console.error('Error fetching Groups:', error);
      }
    );
  }

}
