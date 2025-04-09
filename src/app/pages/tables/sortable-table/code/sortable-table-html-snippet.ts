export const SORTABLE_TABLE_HTML_SNIPPET = `  <div class="table-responsive">
      <mat-table #table [dataSource]="dataSource" matSort style="max-height: 500px; overflow: auto">
        <!-- Position Column -->
        <ng-container matColumnDef="assigned">
          <mat-header-cell *matHeaderCellDef class="f-w-600 mat-subtitle-1 f-s-14 p-l-0">
            Assigned
          </mat-header-cell>
          <mat-cell *matCellDef="let element" class="p-l-0">
            <div class="d-flex align-items-center">
              <img [src]="element.imagePath" alt="users" width="40" class="rounded-circle" />
              <div class="m-l-16">
                <h6 class="mat-subtitle-1 f-s-14 f-w-600">
                  {{ element.uname }}
                </h6>
                <span class="f-s-14 f-s-12">
                  {{ element.position }}
                </span>
              </div>
            </div>
          </mat-cell>
        </ng-container>

        <!-- Name Column -->
        <ng-container matColumnDef="name">
          <mat-header-cell *matHeaderCellDef mat-sort-header class="f-w-600 mat-subtitle-1 f-s-14">
            Name
          </mat-header-cell>
          <mat-cell *matCellDef="let element" class="f-s-14">
            {{ element.name }}
          </mat-cell>
        </ng-container>

        <!-- Weight Column -->
        <ng-container matColumnDef="priority">
          <mat-header-cell *matHeaderCellDef mat-sort-header class="f-w-600 mat-subtitle-1 f-s-14">
            Priority
          </mat-header-cell>
          <mat-cell *matCellDef="let element">
            @if(element.priority == 'low') {
            <span class="bg-light-secondary text-secondary rounded f-w-600 p-6 p-y-4 f-s-12">
              {{ element.priority | titlecase }}
            </span>
            }

            @if(element.priority == 'medium') {
            <span class="bg-light-primary text-primary rounded f-w-600 p-6 p-y-4 f-s-12">
              {{ element.priority | titlecase }}
            </span>
            }

            @if(element.priority == 'high') {
            <span class="bg-light-warning text-warning rounded f-w-600 p-6 p-y-4 f-s-12">
              {{ element.priority | titlecase }}
            </span>
            }

            @if(element.priority == 'critical') {
            <span class="bg-light-error text-error rounded f-w-600 p-6 p-y-4 f-s-12">
              {{ element.priority | titlecase }}
            </span>
            }

            @if(element.priority == 'moderate') {
            <span class="bg-light-success text-success rounded f-w-600 p-6 p-y-4 f-s-12">
              {{ element.priority | titlecase }}
            </span>
            }
          </mat-cell>
        </ng-container>

        <!-- Symbol Column -->
        <ng-container matColumnDef="budget">
          <mat-header-cell *matHeaderCellDef mat-sort-header class="f-w-600 mat-subtitle-1 f-s-14">
            Budget
          </mat-header-cell>
          <mat-cell *matCellDef="let element" class="f-s-14">
            {{ element.budget }}k
          </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
      </mat-table>
    </div>
`;