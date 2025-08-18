import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

@Component({
  selector: 'app-progress-chart',
  templateUrl: './progress-chart.component.html',
  styleUrl: './progress-chart.component.scss'
})
export class ProgressChartComponent implements AfterViewInit, OnChanges {
  @Input() chartConfig?: ChartConfiguration;
  @ViewChild('chartCanvas') chartCanvas?: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;

  constructor() {
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
      this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['chartConfig'] && this.chart) {
        this.chart.data = this.chartConfig?.data || { datasets: [] };
        this.chart.options = this.chartConfig?.options || {};
        this.chart.update();
      }
  }

  private renderChart(): void {
    if (this.chartCanvas?.nativeElement && this.chartConfig) {
      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = new Chart(this.chartCanvas.nativeElement, this.chartConfig);
    }
  }
}
