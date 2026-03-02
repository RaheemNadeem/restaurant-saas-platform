import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
      [ngClass]="[
        'inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-150',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth ? 'w-full' : '',
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      ]"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'soft' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() fullWidth = false;
  @Input() disabled = false;
  
  @Output() onClick = new EventEmitter<MouseEvent>();

  sizeClasses: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  };

  variantClasses: Record<string, string> = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-gray-200 shadow-sm',
    outline: 'border border-border text-foreground hover:bg-accent',
    ghost: 'text-muted-foreground hover:text-foreground hover:bg-accent',
    soft: 'bg-primary-soft text-primary hover:bg-red-100'
  };
}
