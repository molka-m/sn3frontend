import {Injectable, signal} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Group} from '../../models/group';
import {User} from "../../models/user";
import {GroupService} from "../Group/group.service";
import {UserService} from "../user/user.service";

@Injectable({
  providedIn: 'root',
})
export class GroupDisplayService {
  // Signals for reactive state
  collaborateurList = signal<User[]>([]);
  labels = signal<Group[]>([]);
  selectedLabel = signal<Group | null>(null);
  listUuids: string[] = [];
  private selectedCollaborateurSubject = new BehaviorSubject<User | null>(null);
  selectedContact$ = this.selectedCollaborateurSubject.asObservable();

  constructor(private groupService: GroupService, private userService: UserService) {
  }

  setSelectedCollaborateur(collaborateur: User | null) {
    this.selectedCollaborateurSubject.next(collaborateur);
  }

  getSelectedCollaborateur(): User | null {
    return this.selectedCollaborateurSubject.getValue();
  }

  setCollaborateurs(collaborateurs: User[]) {
    this.collaborateurList.set(collaborateurs);
  }

  updateCollaborateur(updatedContact: User) {
    const updatedList = this.collaborateurList().map((contact) =>
      contact.uuid === updatedContact.uuid ? updatedContact : contact
    );
    this.collaborateurList.set(updatedList);

    if (this.getSelectedCollaborateur()?.uuid === updatedContact.uuid) {
      this.setSelectedCollaborateur(updatedContact);
    }
  }

  deleteCollaboraeur(collaborateurToDelete: User) {
    console.log(collaborateurToDelete)
    if (collaborateurToDelete.uuid) {
      this.listUuids.push(collaborateurToDelete.uuid);
    }
    this.groupService.removeUserFromGroup(
      this.selectedLabel()?.groupName,
      this.listUuids
    ).subscribe({
      next: (response) => {
        // Handle successful response here (e.g., update the UI or show a success message)
        console.log('User removed from group successfully', response);
        const updatedList = this.collaborateurList().filter(
          (collab) => collab.uuid !== collaborateurToDelete.uuid
        );
        console.log(updatedList);
        this.collaborateurList.set(updatedList);

        if (this.getSelectedCollaborateur()?.uuid === collaborateurToDelete.uuid) {
          const nextContact = updatedList.length > 0 ? updatedList[0] : null;
          this.setSelectedCollaborateur(nextContact);
        }
      },
      error: (error) => {
        // Handle errors here (e.g., show an error message)
        console.error('Failed to remove user from group', error);
      }
    });

  }

  getContactList(): User[] {
    return this.collaborateurList();
  }

  // Label selection
  applyLabel(group: Group | undefined): void {
    if(group){
      this.selectedLabel.set(group);
    }

    this.labels.set(
      this.labels().map((g) => ({
        ...g,
        active: g === group,
      }))
    );
    const selected = this.selectedLabel(); // Get the current selected group
    if (selected && selected.uuid) {
      this.userService.findByGroupUUID(selected.uuid).subscribe(users => {
        this.setCollaborateurs(users);
      });
    }
  }


  toggleStarred(collab: User, $event: any): void {
    // collab.starred = !collab.starred;
    $event.stopPropagation();
    this.collaborateurList.set([...this.collaborateurList()]);
  }

  // Set labels dynamically from API
  setLabelsFromApi(groups: Group[], uuidSelectedGroup: string | null): void {
    const updated = groups.map((g, index) => ({
      ...g,
      active: index === 0,
    }));
    this.labels.set(updated);
    console.log(uuidSelectedGroup);
    console.log(groups.find(group => group.uuid === uuidSelectedGroup));
    const selectedGroup = groups.find(group => group.uuid === uuidSelectedGroup) || updated[0];
    this.selectedLabel.set(selectedGroup);
  }

}
