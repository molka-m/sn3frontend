import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import {DashboardService} from "../../../services/apps/dashboard.service";

interface month {
  value: string;
  viewValue: string;
}

export interface revenueChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  grid: ApexGrid;
  marker: ApexMarkers;
}

@Component({
  selector: 'app-revenue-updates',
  imports: [NgApexchartsModule, MaterialModule, TablerIconsModule],
  templateUrl: './revenue-updates.component.html',
})
export class AppRevenueUpdatesComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  public revenueChart!: Partial<revenueChart> | any;
  public analyticsData : any ;
  months: month[] = [
    { value: 'mar', viewValue: 'March 2025' },
    { value: 'apr', viewValue: 'April 2025' },
    { value: 'june', viewValue: 'June 2025' },
  ];

  constructor(private apiService : DashboardService) {
  }

  ngOnInit(): void {
    this.apiService.getDashboardAnalytics().subscribe((data) => {
      const ticketsMap: Record<string, number> = data.nbrOfTicketsPerUser;
      this.analyticsData = data;
      const usernames = Object.keys(ticketsMap); // ["john", "jane"]
      const ticketCounts = Object.values(ticketsMap); // [4, 2]

      this.revenueChart = {
        series: [
          {
            name: 'Tickets per User',
            data: ticketCounts, // Ticket counts
            color: '#5D87FF',
          },
        ],

        chart: {
          type: 'bar',
          fontFamily: "'Plus Jakarta Sans', sans-serif;",
          foreColor: '#adb0bb',
          toolbar: {
            show: false,
          },
          height: 340,
        },

        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '40%',
            borderRadius: [6],
            borderRadiusApplication: 'end',
          },
        },

        stroke: {
          show: false,
        },

        dataLabels: {
          enabled: true, // Show data labels (ticket count on bars)
        },

        legend: {
          show: false,
        },

        grid: {
          borderColor: 'rgba(0,0,0,0.1)',
          strokeDashArray: 3,
        },

        yaxis: {
          min: 0,
          tickAmount: 4,
          title: {
            text: 'Number of Tickets',
          },
        },

        xaxis: {
          categories: usernames, // Usernames or user identifiers
          axisBorder: {
            show: false,
          },
          title: {
            text: 'Users',
          },
        },

        tooltip: {
          theme: 'dark',
          fillSeriesColor: false,
        },
      };
    });
  }
}



