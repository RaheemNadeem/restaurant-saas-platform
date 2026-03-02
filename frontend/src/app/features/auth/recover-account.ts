import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-recover-account',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './recover-account.html',
    styleUrl: './recover-account.scss'
})
export class RecoverAccountComponent {
    recoverForm: FormGroup;
    linkSent = false;
    isLoading = false;
    errorMessage: string | null = null;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService
    ) {
        this.recoverForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    onSubmit() {
        if (this.recoverForm.invalid || this.isLoading) {
            this.recoverForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.errorMessage = null;
        const email = this.recoverForm.value.email;

        // Simulate requesting password reset
        this.authService.requestPasswordReset(email).subscribe({
            next: () => {
                this.isLoading = false;
                this.linkSent = true;
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = 'Failed to send recovery link. Please try again.';
                console.error('Recovery error', err);
            }
        });
    }

    resendLink() {
        if (!this.linkSent) return;
        this.linkSent = false; // Reset state to allow re-entry or processing
        this.onSubmit();
    }
}
