import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-reset-success',
    standalone: true,
    imports: [CommonModule, RouterLink, DatePipe],
    templateUrl: './reset-success.html',
    styleUrl: './recover-account.scss' // Reusing animated background
})
export class ResetSuccessComponent {
    // Simulating session info tracking for security context
    timestamp = new Date();

    // These would typically be mapped from a platform/browser info service
    deviceInfo = navigator.userAgent.includes('Mac') ? 'Mac OS (Safari/Chrome)' : 'Windows PC (Chrome/Edge)';
}
