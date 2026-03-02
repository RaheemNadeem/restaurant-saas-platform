import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './reset-password.html',
    styleUrl: './recover-account.scss' // Reusing the same animated background
})
export class ResetPasswordComponent implements OnInit {
    resetForm: FormGroup;
    token: string | null = null;
    isLoading = false;
    errorMessage: string | null = null;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService
    ) {
        this.resetForm = this.fb.group({
            password: ['', [
                Validators.required,
                Validators.minLength(8),
                this.passwordComplexityValidator
            ]],
            confirmPassword: ['', Validators.required]
        }, { validators: this.passwordMatchValidator });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.token = params['token'];
        });
    }

    // Custom complexity validator
    passwordComplexityValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null;

        const hasUpper = /[A-Z]/.test(value);
        const hasLower = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecial = /[^A-Za-z0-9]/.test(value);

        // According to mockup requirements: 1 uppercase, 1 number, 1 special character
        const valid = hasUpper && hasNumber && hasSpecial;

        if (!valid) {
            return { complexity: true };
        }
        return null;
    }

    passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
        const password = group.get('password')?.value;
        const confirm = group.get('confirmPassword')?.value;
        return password === confirm ? null : { mismatch: true };
    }

    // Getters for UI validation state
    get hasMinLength() { return (this.resetForm.get('password')?.value || '').length >= 8; }
    get hasUpperAndNumber() {
        const val = this.resetForm.get('password')?.value || '';
        return /[A-Z]/.test(val) && /[0-9]/.test(val);
    }
    get hasSpecial() { return /[^A-Za-z0-9]/.test(this.resetForm.get('password')?.value || ''); }

    onSubmit() {
        if (this.resetForm.invalid || this.isLoading) {
            this.resetForm.markAllAsTouched();
            return;
        }

        if (!this.token) {
            this.errorMessage = 'Invalid or missing reset token. Please request a new link.';
            return;
        }

        this.isLoading = true;
        this.errorMessage = null;

        const newPassword = this.resetForm.value.password;

        this.authService.resetPassword(this.token, newPassword).subscribe({
            next: () => {
                this.isLoading = false;
                this.router.navigate(['/reset-success']);
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = 'Failed to reset password. The link may have expired.';
                console.error('Reset error', err);
            }
        });
    }
}
