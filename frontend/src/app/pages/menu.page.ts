import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <section class="card">
      <h2>Menu Module Stub</h2>
      <p>Menu CRUD shell connected to tenant-aware API endpoints.</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><th align="left">Item</th><th align="left">Price</th><th align="left">Status</th></tr>
        <tr><td>Classic Burger</td><td>$12.50</td><td>Draft</td></tr>
      </table>
    </section>
  `
})
export class MenuPage {}
