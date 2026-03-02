import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="['bg-card text-card-foreground rounded-2xl border border-border shadow-sm', paddingClass]">
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';

  get paddingClass() {
    switch(this.padding) {
      case 'none': return 'p-0';
      case 'sm': return 'p-4';
      case 'lg': return 'p-8';
      case 'md':
      default: return 'p-5';
    }
  }
}
