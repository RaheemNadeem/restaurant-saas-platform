import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  summary$!: Observable<any>;
  liveOrders$!: Observable<any[]>;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.summary$ = this.dashboardService.getSummary();
    this.liveOrders$ = this.dashboardService.getLiveOrders();
  }
}
