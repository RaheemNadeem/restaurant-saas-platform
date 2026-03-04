import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OnboardingService } from '../../core/services/onboarding.service';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './settings.html',
    styleUrl: './settings.scss',
})
export class Settings implements OnInit {
    activeTab: 'profile' | 'branding' = 'profile';
    isLoading = true;
    isSaving = false;
    saveMessage = '';

    profileForm!: FormGroup;
    brandingForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private onboardingService: OnboardingService
    ) { }

    ngOnInit() {
        this.initForms();
        this.loadData();
    }

    private initForms() {
        this.profileForm = this.fb.group({
            restaurantName: ['', Validators.required],
            address: ['', Validators.required],
            phone: ['', Validators.required],
            restaurantType: ['Fast Casual']
        });

        this.brandingForm = this.fb.group({
            primaryColor: ['#BF4444'],
            typography: ['Inter'],
            logoUrl: [''],
            description: ['']
        });
    }

    private loadData() {
        this.isLoading = true;
        this.onboardingService.getStatus().subscribe({
            next: (data) => {
                this.profileForm.patchValue({
                    restaurantName: data.restaurantName || '',
                    address: data.address || '',
                    phone: data.phone || '',
                    restaurantType: data.restaurantType || 'Fast Casual'
                });
                this.brandingForm.patchValue({
                    primaryColor: data.primaryColor || '#BF4444',
                    typography: data.typography || 'Inter',
                    logoUrl: data.logoUrl || '',
                    description: data.description || ''
                });
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    switchTab(tab: 'profile' | 'branding') {
        this.activeTab = tab;
        this.saveMessage = '';
    }

    saveProfile() {
        if (this.profileForm.invalid) {
            this.profileForm.markAllAsTouched();
            return;
        }
        this.isSaving = true;
        this.onboardingService.saveProfile(this.profileForm.value).subscribe({
            next: () => {
                this.isSaving = false;
                this.saveMessage = 'Profile saved successfully!';
                setTimeout(() => this.saveMessage = '', 3000);
            },
            error: () => {
                this.isSaving = false;
                this.saveMessage = 'Failed to save profile.';
            }
        });
    }

    saveBranding() {
        this.isSaving = true;
        this.onboardingService.saveBranding(this.brandingForm.value).subscribe({
            next: () => {
                this.isSaving = false;
                this.saveMessage = 'Branding saved successfully!';
                setTimeout(() => this.saveMessage = '', 3000);
            },
            error: () => {
                this.isSaving = false;
                this.saveMessage = 'Failed to save branding.';
            }
        });
    }
}
