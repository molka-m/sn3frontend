import { Component, ViewChild } from '@angular/core';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import {DashboardService} from "../../../services/apps/dashboard.service";

export interface yearlyChart {
  series: number[]; // ✅ Donut/pie expects a simple number array
  chart: ApexChart;
  labels: string[]; // ✅ Important for correct tooltip behavior
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive?: ApexResponsive;
  colors?: string[];
}

@Component({
  selector: 'app-yearly-breakup',
  imports: [MaterialModule, NgApexchartsModule, TablerIconsModule],
  templateUrl: './yearly-breakup.component.html',
})
export class AppYearlyBreakupComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public yearlyChart!: Partial<yearlyChart> | any;
  public analyticsData :any
  constructor(private apiService : DashboardService) {

  }

  ngOnInit(): void {
    this.apiService.getDashboardAnalytics().subscribe((data) => {
      const ticketsMap: Record<string, number> = data.nbrOfTicketsPerUser;
      this.analyticsData = data;

      const assigned = data.nbrAssignedUser;
      const unassigned = data.nbrNonAssignedUser;
      const total = assigned + unassigned;
      const percentage = total > 0 ? (assigned / total) * 100 : 0;

      this.yearlyChart = {
        series: [assigned, unassigned],
        chart: {
          type: 'donut',
          height: 200,
          toolbar: { show: false },
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          foreColor: '#5D87FF',
        },
        labels: ['assigned', 'Not Assigned'],
        colors: ['#5D87FF', '#60d71e'], // blue and soft gray
        plotOptions: {
          pie: {
            donut: {
              size: '70%',
              labels: {
                show: true,
                name: {
                  show: false,
                },
                value: {
                  show: false,
                },
                total: {
                  show: true,
                  label: '',
                  fontSize: '20px',
                  color: '#5D87FF',
                  fontWeight: 600,
                  formatter: () => `${percentage.toFixed(0)}%`,
                },
              },
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: false,
        },
        legend: {
          show: false,
        },
        tooltip: {
          enabled: true,
          y: {
            formatter: (val: number) => `${val} users`,
          },
        },
      };
    });
  }



}
