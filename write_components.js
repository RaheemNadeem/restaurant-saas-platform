const fs = require('fs');
const path = require('path');

const components = {
    'button': `import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: \`
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
  \`
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
`,

    'input': `import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: \`
    <div class="mb-4 w-full">
      <label *ngIf="label" class="block text-sm font-medium text-foreground mb-1.5">{{ label }}</label>
      <div class="relative">
        <span *ngIf="icon" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" [innerHTML]="icon"></span>
        <input
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onTouched()"
          [ngClass]="[
            'w-full py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-soft transition-shadow',
            icon ? 'pl-9 pr-3' : 'px-3',
            error ? 'border-destructive focus:border-destructive text-destructive' : 'border border-border text-foreground',
            disabled ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-background placeholder:text-muted-foreground'
          ]"
        />
      </div>
      <p *ngIf="error" class="mt-1.5 text-xs text-destructive">{{ error }}</p>
    </div>
  \`
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() icon = '';
  @Input() error = '';
  
  value = '';
  disabled = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.value = value || '';
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }
}
`,

    'card': `import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div [ngClass]="['bg-card text-card-foreground rounded-2xl border border-border shadow-sm', paddingClass]">
      <ng-content></ng-content>
    </div>
  \`
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
`
};

for (const [name, content] of Object.entries(components)) {
    const dir = path.join(__dirname, 'frontend', 'src', 'app', 'shared', 'components', name);
    const tsFile = path.join(dir, `${name}.ts`);
    fs.writeFileSync(tsFile, content, 'utf8');
}
console.log('Successfully wrote the UI component templates.');
