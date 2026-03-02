import { Component, Input, forwardRef } from '@angular/core';
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
  template: `
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
  `
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
