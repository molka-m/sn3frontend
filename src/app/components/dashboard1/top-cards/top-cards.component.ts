import {Component, OnInit} from '@angular/core';
import {MaterialModule} from '../../../material.module';
import {DashboardService} from "../../../services/apps/dashboard.service";

interface topcards {
  id: number;
  img: string;
  color: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-top-cards',
  imports: [MaterialModule],
  templateUrl: './top-cards.component.html',
})
export class AppTopCardsComponent implements OnInit {
  topcards: topcards[] = [
    {
      id: 1,
      color: 'primary',
      img: '/assets/images/svgs/icon-user-male.svg',
      title: 'Users',
      subtitle: '...',
    },
    {
      id: 2,
      color: 'warning',
      img: '/assets/images/svgs/icon-briefcase.svg',
      title: 'Tickets',
      subtitle: '...',
    },
    {
      id: 3,
      color: 'secondary',
      img: '/assets/images/svgs/icon-mailbox.svg',
      title: 'Application',
      subtitle: '...',
    },
    {
      id: 4,
      color: 'error',
      img: '/assets/images/svgs/icon-favorites.svg',
      title: 'Groups',
      subtitle: '...',
    },
    /*    {
          id: 5,
          color: 'success',
          img: '/assets/images/svgs/icon-speech-bubble.svg',
          title: 'Payroll',
          subtitle: '$96k',
        },
        {
          id: 6,
          color: 'secondary',
          img: '/assets/images/svgs/icon-connect.svg',
          title: 'Reports',
          subtitle: '59',
        },*/
  ];

  constructor(private dashboardService: DashboardService) {
  }

  ngOnInit(): void {
    this.dashboardService.getDashboardAnalytics().subscribe(data => {
      this.topcards[0].subtitle = data.totalNumberOfNonAdminUsers.toString();
      this.topcards[1].subtitle = data.totalNumberOfTickets.toString(); // formatted with commas
      this.topcards[2].subtitle = data.totalNumberOfApplications.toString();
      this.topcards[3].subtitle = data.totalNumberOfGroups.toString();
      /*      this.topcards[4].subtitle = `$${(data.payroll / 1000).toFixed(0)}k`; // convert to $96k
            this.topcards[5].subtitle = data.reports.toString();*/
    });
  }

}
