import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <section class="card">
      <h2>Dashboard Stub</h2>
      <p>Operations summary placeholder for orders, revenue, and alerts.</p>
      <div style="display:grid;grid-template-columns:repeat(3,minmax(120px,1fr));gap:10px;">
        <div class="card"><strong>Open Orders</strong><br/>0</div>
        <div class="card"><strong>Today Revenue</strong><br/>$0</div>
        <div class="card"><strong>Pending Refunds</strong><br/>0</div>
      </div>
    </section>
  `
})
export class DashboardPage {}
