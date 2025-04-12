import { Component, computed, OnInit, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GroupDisplayService } from 'src/app/services/apps/group-list/group-display.service';
import { AppDeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GroupBox } from 'src/app/pages/apps/group-list/group-list';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import {User} from "../../../../services/models/user";
@Component({
  selector: 'app-detail',
  imports: [
    MatDividerModule,
    FormsModule,
    CommonModule,
    MaterialModule,
    TablerIconsModule,
    NgScrollbarModule,
  ],
  templateUrl: './detail.component.html',
})
export class AppContactListDetailComponent implements OnInit {
  isEditing = signal<boolean>(false);
  collaborateur = signal<User | null>(null);
  formData = signal<any | null>(null);
  selectedCollaborateur = computed(() => this.groupDisplayService.getSelectedCollaborateur());

  constructor(
    public dialog: MatDialog,
    private groupDisplayService: GroupDisplayService,
    private snackBar: MatSnackBar
  ) {}

  departments = [
    { id: 1, name: 'Sales' },
    { id: 2, name: 'Support' },
    { id: 2, name: 'Engineering' },
  ];

  ngOnInit(): void {
    this.groupDisplayService.selectedContact$.subscribe((contact) => {
      this.collaborateur.set(contact);
      this.formData.set(contact ? { ...contact } : null);
    });
  }

  toggleStarred(collaborateur: User | null, event: Event): void {
    if(collaborateur){
      this.groupDisplayService.toggleStarred(collaborateur, event);
      this.groupDisplayService.updateCollaborateur(collaborateur);
    }
  }

  saveCollaborateur(): void {
    const collaborateur = this.formData();
    if (collaborateur) {
      this.groupDisplayService.updateCollaborateur(collaborateur);
      this.isEditing.set(false);
    }
  }

  track(department: any) {
    return department.id;
  }

  editCollaborateur(): void {
    this.isEditing.set(true);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    this.formData.set(this.collaborateur() ? { ...this.collaborateur() } : null);
  }

  deleteCollaborateur(collaborateur: User | null): void {
    if (collaborateur) {
      const dialogRef = this.dialog.open(AppDeleteDialogComponent, {
        width: '300px',
        data: {
          message: `Are you sure you want to delete ${collaborateur.firstName} ${collaborateur.lastName}?`,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.groupDisplayService.deleteCollaboraeur(collaborateur);
        }
      });
    }
  }
}
