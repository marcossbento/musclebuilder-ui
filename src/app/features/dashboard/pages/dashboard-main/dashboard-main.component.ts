import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { ProgressService } from '../../../../core/services/progress.service';
import {
  ExerciseProgressDTO,
  ProgressSummaryDTO,
} from '../../../../core/models/progress.model';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrl: './dashboard-main.component.scss',
})
export class DashboardMainComponent implements OnInit {
  private authService = inject(AuthService);
  private progressService = inject(ProgressService);

  isLoading = true;
  progressSummary?: ProgressSummaryDTO;

  exerciseProgressChartConfig?: ChartConfiguration;
  exerciseIdToTrack = 1;

  ngOnInit(): void {
    this.progressService.getProgressSummary().subscribe((summary) => {
      this.progressSummary = summary;
      this.loadChartData();
    });
  }

  loadChartData(): void {
    this.progressService
      .getExerciseProgress(this.exerciseIdToTrack)
      .subscribe((progressData) => {
        this.setupChart(progressData);
        this.isLoading = false;
      });
  }

  setupChart(data: ExerciseProgressDTO[]): void {
    const labels = data.map((d) => d.date);
    const maxWeightData = data.map((d) => d.maxWeight);
    const textColor = '#EAEAEA';
    const gridColor = '#5A5A7E'; 
    const accentColor = '#00F2E5'; 

    this.exerciseProgressChartConfig = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Peso Máximo (kg)',
          data: maxWeightData,
          borderColor: accentColor,
          backgroundColor: 'rgba(0, 242, 229, 0.2)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: accentColor,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: { unit: 'day' },
            ticks: {
              color: textColor
            },
            grid: {
              color: gridColor 
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: textColor 
            },
            grid: {
              color: gridColor 
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: textColor, 
              font: {
                family: "'Pixelify Sans', sans-serif",
                size: 14
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(26, 26, 46, 0.9)', // Usa a cor de fundo com transparência
            titleFont: { family: "'Press Start 2P', cursive" },
            bodyFont: { family: "'Pixelify Sans', sans-serif" }
          }
        }
      }
    };
  }

  logout(): void {
    this.authService.logout();
  }
}
