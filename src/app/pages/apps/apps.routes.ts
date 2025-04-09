import {Routes} from '@angular/router';

import {AppChatComponent} from './chat/chat.component';
import {AppEmailComponent} from './email/email.component';
import {DetailComponent} from './email/detail/detail.component';
import {AppCoursesComponent} from './courses/courses.component';
import {AppCourseDetailComponent} from './courses/course-detail/course-detail.component';
import {AppBlogsComponent} from './blogs/blogs.component';
import {AppBlogDetailsComponent} from './blogs/details/details.component';
import {AppNotesComponent} from './notes/notes.component';
import {AppTodoComponent} from './todo/todo.component';
import {AppPermissionComponent} from './permission/permission.component';
import {AppKanbanComponent} from './kanban/kanban.component';
import {AppFullcalendarComponent} from './fullcalendar/fullcalendar.component';
import {AppTicketlistComponent} from './tickets/tickets.component';
import {AppInvoiceListComponent} from './invoice/invoice-list/invoice-list.component';
import {AppAddInvoiceComponent} from './invoice/add-invoice/add-invoice.component';
import {AppInvoiceViewComponent} from './invoice/invoice-view/invoice-view.component';
import {AppEditInvoiceComponent} from './invoice/edit-invoice/edit-invoice.component';
import {AppContactListComponent} from './contact-list/contact-list.component';
import {AppCollaborateurComponent} from "./collaborateur/collaborateur.component";
import {AppUserComponent} from "./employee/user.component";
import {AppApplicationComponent} from "./application/application.component";
import {AppGroupComponent} from "./groups/group.component";


export const AppsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'user',
        component: AppUserComponent,
        data: {
          title: 'User',
          urls: [
            {title: 'Dashboard', url: '/dashboards/dashboard1'},
            {title: 'User'},
          ],
        },
      },
      {
        path: 'group',
        component: AppGroupComponent,
        data: {
          title: 'Group',
          urls: [
            {title: 'Dashboard', url: '/dashboards/dashboard1'},
            {title: 'Group'},
          ],
        },
      },
      {
        path: 'application',
        component: AppApplicationComponent,
        data: {
          title: 'Application',
          urls: [
            {title: 'Dashboard', url: '/dashboards/dashboard1'},
            {title: 'Application'},
          ],
        },
      },
      {
        path: 'collaborateur',
        component: AppCollaborateurComponent,
        data: {
          title: 'Collaborateur',
          urls: [
            {title: 'Dashboard', url: '/dashboards/dashboard1'},
            {title: 'Collaborateur'},
          ],
        },
      },
      {
        path: 'chat',
        component: AppChatComponent,
        data: {
          title: 'Chat',
          urls: [
            {title: 'Dashboard', url: '/dashboards/dashboard1'},
            {title: 'Chat'},
          ],
        },
      },
      {
        path: 'calendar',
        component: AppFullcalendarComponent,
        data: {
          title: 'Calendar',
          urls: [
            {title: 'Dashboard', url: '/dashboards/dashboard1'},
            {title: 'Calendar'},
          ],
        },
      },
      {
        path: 'notes',
        component: AppNotesComponent,
        data: {
          title: 'Notes',
          urls: [
            {title: 'Dashboard', url: '/dashboards/dashboard1'},
            {title: 'Notes'},
          ],
        },
      },
      {path: 'email', redirectTo: 'email/inbox', pathMatch: 'full'},
      {
        path: 'email/:type',
        component: AppEmailComponent,
        data: {
          title: 'Email',
          urls: [
            {title: 'Dashboard', url: '/dashboards/dashboard1'},
            {title: 'Email'},
          ],
        },
        children: [
          {
            path: ':id',
            component: DetailComponent,
            data: {
              title: 'Email Detail',
              urls: [
                {title: 'Dashboard', url: '/dashboards/dashboard1'},
                {title: 'Email Detail'},
              ],
            },
          },
        ],
      },
      {
        path: 'permission',
        component: AppPermissionComponent,
        data: {
          title: 'Roll Base Access',
          urls: [
            {title: 'Dashboard', url: '/dashboards/dashboard1'},
            {title: 'Roll Base Access'},
          ],
        },
      },
      {
        path: 'todo',
        component: AppTodoComponent,
        data: {
          title: 'Todo App',
          urls: [
            {title: 'Dashboard', url: '/dashboards/dashboard1'},
            {title: 'Todo App'},
          ],
        },
      },
      {
        path: 'kanban',
        component: AppKanbanComponent,
        data: {
          title: 'Kanban',
          urls: [
            {title: 'Dashboard', url: '/dashboards/dashboard1'},
            {title: 'Kanban'},
          ],
        },
      },
      {
        path: 'tickets',
        component: AppTicketlistComponent,
        data: {
          title: 'Tickets',
          urls: [
            {title: 'Dashboard', url: '/dashboards/dashboard1'},
            {title: 'Tickets'},
          ],
        },
      },
      {
        path: 'courses',
        component: AppCoursesComponent,
        data: {
          title: 'Courses',
          urls: [
            {title: 'Dashboard', url: '/dashboards/dashboard1'},
            {title: 'Courses'},
          ],
        },
      },
      {
        path: 'contact-list',
        component: AppContactListComponent,
        data: {
          title: 'Contact List',
          urls: [
            {title: 'Dashboard', url: '/dashboards/dashboard1'},
            {title: 'Contact List'},
          ],
        },
      },
      {
        path: 'courses/coursesdetail/:id',
        component: AppCourseDetailComponent,
        data: {
          title: 'Course Detail',
          urls: [
            {title: 'Dashboard', url: '/dashboards/dashboard1'},
            {title: 'Course Detail'},
          ],
        },
      },
      {
        path: 'blog/post',
        component: AppBlogsComponent,
        data: {
          title: 'Posts',
          urls: [
            {title: 'Dashboard', url: '/dashboards/dashboard1'},
            {title: 'Posts'},
          ],
        },
      },
      {
        path: 'blog/detail/:id',
        component: AppBlogDetailsComponent,
        data: {
          title: 'Blog Detail',
          urls: [
            {title: 'Dashboard', url: '/dashboards/dashboard1'},
            {title: 'Blog Detail'},
          ],
        },
      },

      {
        path: 'invoice',
        component: AppInvoiceListComponent,
        data: {
          title: 'Invoice',
          urls: [
            {title: 'Dashboard', url: '/dashboards/dashboard1'},
            {title: 'Invoice'},
          ],
        },
      },
      {
        path: 'addInvoice',
        component: AppAddInvoiceComponent,
        data: {
          title: 'Add Invoice',
          urls: [
            {title: 'Dashboard', url: '/dashboards/dashboard1'},
            {title: 'Add Invoice'},
          ],
        },
      },
      {
        path: 'viewInvoice/:id',
        component: AppInvoiceViewComponent,
        data: {
          title: 'View Invoice',
          urls: [
            {title: 'Dashboard', url: '/dashboards/dashboard1'},
            {title: 'View Invoice'},
          ],
        },
      },
      {
        path: 'editinvoice/:id',
        component: AppEditInvoiceComponent,
        data: {
          title: 'Edit Invoice',
          urls: [
            {title: 'Dashboard', url: '/dashboards/dashboard1'},
            {title: 'Edit Invoice'},
          ],
        },
      },
    ],
  },
];
