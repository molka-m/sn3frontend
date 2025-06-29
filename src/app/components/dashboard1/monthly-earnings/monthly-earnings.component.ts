import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTooltip,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import {MaterialModule} from '../../../material.module';
import {TablerIconsModule} from 'angular-tabler-icons';
import {DashboardService} from "../../../services/apps/dashboard.service";

export interface monthlyChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive;
}

@Component({
  selector: 'app-monthly-earnings',
  imports: [NgApexchartsModule, MaterialModule, TablerIconsModule],
  templateUrl: './monthly-earnings.component.html',
})
export class AppMonthlyEarningsComponent implements OnInit {
  public analyticsData : any ;
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public monthlyChart!: Partial<monthlyChart> | any;

  constructor(private apiService : DashboardService) {

  }

  ngOnInit(): void {
    this.apiService.getDashboardAnalytics().subscribe((data) => {
      const ticketsMap: Record<string, number> = data.nbrOfTicketsPerUser;
      this.analyticsData = data;
      this.monthlyChart = {
        series: [
          {
            name: '',
            color: '#49BEFF',
            data: [25, 66, 20, 40, 12, 58, 20],
          },
        ],

        chart: {
          type: 'area',
          fontFamily: "'Plus Jakarta Sans', sans-serif;",
          foreColor: '#adb0bb',
          toolbar: {
            show: false,
          },
          height: 60,
          sparkline: {
            enabled: true,
          },
          group: 'sparklines',
        },
        stroke: {
          curve: 'smooth',
          width: 2,
        },
        fill: {
          colors: ['#E8F7FF'],
          type: 'solid',
          opacity: 0.05,
        },
        markers: {
          size: 0,
        },
        tooltip: {
          theme: 'dark',
          x: {
            show: false,
          },
        },
      };
    });
  }
}
