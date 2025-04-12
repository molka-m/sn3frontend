import {Injectable, signal} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ContactList} from 'src/app/pages/apps/group-list/groupListData';
import {GroupBox} from 'src/app/pages/apps/group-list/group-list';
import {Group} from '../../models/group';
import {User} from "../../models/user";

@Injectable({
  providedIn: 'root',
})
export class GroupDisplayService {
  // Signals for reactive state
  collaborateurList = signal<User[]>([]);
  labels = signal<Group[]>([]);
  selectedLabel = signal<Group | null>(null);

  private selectedCollaborateurSubject = new BehaviorSubject<User | null>(null);
  selectedContact$ = this.selectedCollaborateurSubject.asObservable();

  constructor() {
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
    const updatedList = this.collaborateurList().filter(
      (collab) => collab.uuid !== collaborateurToDelete.uuid
    );
    this.collaborateurList.set(updatedList);

    if (this.getSelectedCollaborateur()?.uuid === collaborateurToDelete.uuid) {
      const nextContact = updatedList.length > 0 ? updatedList[0] : null;
      this.setSelectedCollaborateur(nextContact);
    }
  }

  getContactList(): User[] {
    return this.collaborateurList();
  }

  // Label selection
  applyLabel(group: Group): void {
    this.selectedLabel.set(group);
    this.labels.set(
      this.labels().map((g) => ({
        ...g,
        active: g === group,
      }))
    );
  }

  toggleStarred(collab: User, $event: any): void {
   // collab.starred = !collab.starred;
    $event.stopPropagation();
    this.collaborateurList.set([...this.collaborateurList()]);
  }

  // Set labels dynamically from API
  setLabelsFromApi(groups: Group[]): void {
    const updated = groups.map((g, index) => ({
      ...g,
      active: index === 0,
    }));
    this.labels.set(updated);
    this.selectedLabel.set(updated[0]);
  }
}
