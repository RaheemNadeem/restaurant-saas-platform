import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <section class="card">
      <h2>Auth Stub</h2>
      <p>Merchant sign-in/up entry point (Sprint 1 shell).</p>
      <ul>
        <li>Email + password login</li>
        <li>Role scaffold: owner/manager/staff</li>
      </ul>
    </section>
  `
})
export class AuthPage {}
