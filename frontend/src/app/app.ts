import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <h1>Restaurant SaaS · Sprint 1 Shell</h1>
      <nav>
        <a routerLink="/auth" routerLinkActive="active">Auth</a>
        <a routerLink="/onboarding" routerLinkActive="active">Onboarding</a>
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/menu" routerLinkActive="active">Menu</a>
      </nav>
    </header>

    <main class="page-wrap">
      <router-outlet />
    </main>
  `,
  styleUrl: './app.scss'
})
export class App {}
