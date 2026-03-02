import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Merchant {
    id: string;
    name: string;
    email: string;
    createdAt: string;
}

interface PlatformSummary {
    totalMerchants: number;
    totalOrders: number;
    totalRevenue: number;
    asOf: string;
}

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="admin-container">
      <header class="admin-header">
        <h1>QuickServe Admin</h1>
        <p class="subtitle">Platform-wide tenant management</p>
      </header>

      <!-- Summary Cards -->
      <div class="summary-cards" *ngIf="summary">
        <div class="card">
          <span class="label">Total Merchants</span>
          <span class="value">{{ summary.totalMerchants }}</span>
        </div>
        <div class="card">
          <span class="label">Total Orders</span>
          <span class="value">{{ summary.totalOrders }}</span>
        </div>
        <div class="card">
          <span class="label">Total Revenue</span>
          <span class="value">{{ summary.totalRevenue | currency }}</span>
        </div>
      </div>

      <!-- Loading -->
      <p *ngIf="isLoading" class="loading">Loading tenants...</p>

      <!-- Tenant Table -->
      <div class="table-container" *ngIf="!isLoading && merchants.length > 0">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Signed Up</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let m of merchants; let i = index">
              <td>{{ i + 1 }}</td>
              <td>{{ m.name }}</td>
              <td>{{ m.email }}</td>
              <td>{{ m.createdAt | date:'mediumDate' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p *ngIf="!isLoading && merchants.length === 0" class="empty">
        No merchants registered yet.
      </p>

      <p *ngIf="error" class="error">{{ error }}</p>
    </div>
  `,
    styles: [`
    .admin-container {
      max-width: 960px;
      margin: 0 auto;
      padding: 2rem;
      font-family: 'Inter', sans-serif;
    }

    .admin-header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 0.25rem;
    }

    .subtitle {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin: 1.5rem 0;
    }

    .card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      padding: 1.25rem;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
    }

    .card .label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      opacity: 0.85;
    }

    .card .value {
      font-size: 1.75rem;
      font-weight: 700;
      margin-top: 0.25rem;
    }

    .table-container {
      overflow-x: auto;
      margin-top: 1.5rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      text-align: left;
      padding: 0.75rem 1rem;
      font-size: 0.75rem;
      text-transform: uppercase;
      color: #6b7280;
      border-bottom: 2px solid #e5e7eb;
    }

    td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #f3f4f6;
      font-size: 0.875rem;
      color: #374151;
    }

    tr:hover td {
      background: #f9fafb;
    }

    .loading, .empty {
      text-align: center;
      color: #6b7280;
      padding: 2rem;
    }

    .error {
      color: #dc2626;
      text-align: center;
      padding: 1rem;
    }
  `]
})
export class AdminComponent implements OnInit {
    merchants: Merchant[] = [];
    summary: PlatformSummary | null = null;
    isLoading = true;
    error = '';

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.isLoading = true;

        this.http.get<PlatformSummary>(`${environment.apiUrl}/admin/summary`).subscribe({
            next: (data) => this.summary = data,
            error: (err) => this.error = 'Failed to load platform summary.'
        });

        this.http.get<Merchant[]>(`${environment.apiUrl}/admin/tenants`).subscribe({
            next: (data) => {
                this.merchants = data;
                this.isLoading = false;
            },
            error: (err) => {
                this.error = 'Failed to load tenant list. Ensure you have Admin role.';
                this.isLoading = false;
            }
        });
    }
}
