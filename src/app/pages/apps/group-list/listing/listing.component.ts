import {ChangeDetectorRef, Component, computed, inject, OnDestroy, OnInit, signal,} from '@angular/core';
import {AppContactListDetailComponent} from '../detail/detail.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {GroupFormDialogComponent} from '../group-form-dialog/group-form-dialog.component';
import {MaterialModule} from 'src/app/material.module';
import {TablerIconsModule} from 'angular-tabler-icons';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {MediaMatcher} from '@angular/cdk/layout';
import {GroupDisplayService} from 'src/app/services/apps/group-list/group-display.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppDeleteDialogComponent} from '../delete-dialog/delete-dialog.component';
import {AppSearchDialogComponent} from 'src/app/layouts/full/vertical/header/header.component';
import {CommonModule} from '@angular/common';
import {MatDividerModule} from '@angular/material/divider';
import {Group} from '../../../../services/models/group';
import {GroupService} from '../../../../services/apps/Group/group.service';
import {UserService} from "../../../../services/apps/user/user.service";
import {User} from "../../../../services/models/user";

@Component({
    selector: 'app-group-listing',
    imports: [
        CommonModule,
        FormsModule,
        AppContactListDetailComponent,
        MaterialModule,
        ReactiveFormsModule,
        TablerIconsModule,
        NgScrollbarModule,
        MatDividerModule,
    ],
    templateUrl: './listing.component.html',
})
export class AppListingComponent implements OnInit, OnDestroy {
    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    constructor(
        public dialog: MatDialog,
        public groupDisplayService: GroupDisplayService,
        private snackBar: MatSnackBar,
        private groupService: GroupService,
        private userService: UserService,
    ) {
        const changeDetectorRef = inject(ChangeDetectorRef);
        const media = inject(MediaMatcher);
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    searchTerm = signal<string>('');
    private mediaMatcher: MediaQueryList = matchMedia(`(max-width: 1199px)`);

    labels: Group[] = [];
    selectedLabel: Group | null = null;
    selectedContact = signal<User | null>(null);
    isActiveContact: boolean = false;
    mailnav = true;

    isOver(): boolean {
        return this.mediaMatcher.matches;
    }

    openDialog() {
        const dialogRef = this.dialog.open(AppSearchDialogComponent, {
            autoFocus: false,
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);
        });
    }

    filteredCollaborateur = computed(() => {
        let filtered = this.groupDisplayService.collaborateurList();
        console.log(filtered);
        const selected = this.groupDisplayService.selectedLabel();
        /*        if (selected && selected.groupName !== 'All') {
                    if (selected.groupName === 'Frequent') {
                        filtered = filtered.filter((contact) => contact.frequentlycontacted);
                    } else if (selected.groupName === 'Starred') {
                        filtered = filtered.filter((contact) => contact.starred);
                    } else {
                        filtered = filtered.filter(
                            (contact) => contact.department === selected.groupName
                        );
                    }
                }*/

        /*        const searchTermLower = this.searchTerm().toLowerCase();
                filtered = filtered.filter(
                    (collaborateur) =>
                        collaborateur.firstName.toLowerCase().includes(searchTermLower) ||
                        collaborateur.lastName.toLowerCase().includes(searchTermLower)
                );*/
        return filtered;
    });

    ngOnInit() {
        this.labels = this.groupDisplayService.labels();
        this.selectedLabel = this.groupDisplayService.selectedLabel();

        this.groupDisplayService.collaborateurList.set(
            this.groupDisplayService.collaborateurList()
        );
        this.loadAllGroups();
        this.loadAllUsers();
        const collaborateur = this.groupDisplayService.collaborateurList();
        this.selectedContact.set(collaborateur[0]);

        this.groupDisplayService.setLabelsFromApi(this.labels);
    }

    goBack() {
        this.selectedContact.set(null);
        this.isActiveContact = false;
    }

    selectContact(contact: User): void {
        this.isActiveContact = true;
        this.selectedContact.set(contact);
        this.groupDisplayService.setSelectedCollaborateur(contact);
    }

    applyLabel(group: Group): void {
        this.groupDisplayService.applyLabel(group);
    }

    toggleStarred(collaborateur: User, $event: any): void {
        this.groupDisplayService.toggleStarred(collaborateur, $event);
    }

    deleteContact(Collab: User): void {
        const dialogRef = this.dialog.open(AppDeleteDialogComponent, {
            width: '300px',
            autoFocus: false,
            data: {
                message: `Are you sure you want to delete ${Collab.firstName} ${Collab.lastName}?`,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.groupDisplayService.deleteCollaboraeur(Collab);
                if (
                    this.selectedContact() &&
                    this.selectedContact()?.uuid === Collab.uuid
                ) {
                    this.groupDisplayService.setSelectedCollaborateur(null);
                    this.selectedContact.set(null);
                }
                this.snackBar.open(
                    `${Collab.firstName} ${Collab.lastName} deleted successfully!`,
                    'Close',
                    {
                        duration: 3000,
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                    }
                );
            }
        });
    }

    openAddContactDialog(): void {
        const dialogRef = this.dialog.open(GroupFormDialogComponent, {
            width: '400px',
            autoFocus: false,
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.groupDisplayService.collaborateurList.set([
                    result,
                    ...this.groupDisplayService.collaborateurList(),
                ]);
                this.groupDisplayService.setSelectedCollaborateur(result);
                this.selectedContact.set(result);
            }
        });
    }

    loadAllGroups(): void {
        this.groupService.findAllGroups().subscribe(
            (response: Group[]) => {
                this.labels = response;
                this.groupDisplayService.labels.set(response);
            },
            (error: any) => {
                console.error('Error fetching Groups:', error);
            }
        );
    }

    loadAllUsers(): void {
        this.userService.findAllNonAdminUsers().subscribe(
            (response: User[]) => {
                this.groupDisplayService.setCollaborateurs(response); // Set the full list
                if (response.length > 0) {
                    this.groupDisplayService.setSelectedCollaborateur(response[0]); // Set first user as selected
                }
            },
            (error) => {
                console.error("Error fetching users:", error);
            }
        );
    }

}
