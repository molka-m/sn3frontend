import {Component, signal} from '@angular/core';
import {InvoiceService} from 'src/app/services/apps/invoice/invoice.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {MaterialModule} from 'src/app/material.module';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TablerIconsModule} from 'angular-tabler-icons';
import {Task} from "../../../../services/models/tasks";
import {TaskService} from "../../../../services/apps/ticket/task.service";

@Component({
  selector: 'app-invoice-view',
  templateUrl: './task-view.component.html',
  imports: [
    MaterialModule,
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
  ]
})
export class AppInvoiceViewComponent {
  uuid : string | null ;
  taskDetail = signal<Task | null>(null);
  displayedColumns: string[] = ['itemName', 'unitPrice', 'unit', 'total'];

  constructor(
    private activatedRouter: ActivatedRoute,
    private invoiceService: InvoiceService,
    private taskService: TaskService,
  ) {
  }

  ngOnInit(): void {
    this.uuid = this.activatedRouter.snapshot.paramMap.get('uuid');
    console.log(this.uuid?.toString());
    this.loadTask();

  }

  loadTask(): void {
    this.taskService.findTaskByUuid(this.uuid?.toString()).subscribe((task) => {
      console.log(task);
      this.taskDetail.set(task)
    });
  }
}
