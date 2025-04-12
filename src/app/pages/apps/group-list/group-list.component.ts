import { Component } from '@angular/core';
import { AppListingComponent } from 'src/app/pages/apps/group-list/listing/listing.component';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-group-list',
  imports: [AppListingComponent, TablerIconsModule, MaterialModule],
  templateUrl: './group-list.component.html',
})
export class AppGroupListComponent {}
