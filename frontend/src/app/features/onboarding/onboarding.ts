import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OnboardingService } from '../../core/services/onboarding.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss',
})
export class Onboarding implements OnInit {
  currentStep = 1;
  totalSteps = 5;

  onboardingForm!: FormGroup;

  // Track progress status visually on the right sidebar
  steps = [
    { id: 1, label: 'Business', status: 'In Progress' }, // Pending, In Progress, Complete
    { id: 2, label: 'Branding', status: 'Pending' },
    { id: 3, label: 'Menu', status: 'Pending' },
    { id: 4, label: 'Payments', status: 'Pending' },
    { id: 5, label: 'Publish', status: 'Pending' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private onboardingService: OnboardingService
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadDraftData();
  }

  private initForm() {
    // A singular robust form that breaks down into group sections per step
    this.onboardingForm = this.fb.group({
      businessGroup: this.fb.group({
        restaurantName: ['', Validators.required],
        ownerName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        restaurantType: ['Fast Casual'],
        address: ['', Validators.required]
      }),
      brandGroup: this.fb.group({
        displayBrandName: ['', Validators.required],
        logoFile: [null],
        primaryColor: ['#BF4444'],
        typography: ['Inter'],
        description: ['']
      }),
      menuGroup: this.fb.group({
        categoryName: ['', Validators.required],
        itemName: ['', Validators.required],
        itemPrice: ['', Validators.required]
      }),
      paymentGroup: this.fb.group({
        legalName: ['', Validators.required],
        taxId: ['', Validators.required],
        bankAccount: ['', Validators.required],
        payoutSchedule: ['Daily']
      })
    });
  }

  private loadDraftData() {
    this.onboardingService.getStatus().subscribe({
      next: (status) => {
        if (!status) return;

        // Hydrate profile data
        if (status.restaurantName) {
          this.businessGroup.patchValue({
            restaurantName: status.restaurantName,
            address: status.address || '',
            phone: status.phone || '',
            restaurantType: status.restaurantType || 'Fast Casual'
          });
          this.brandGroup.patchValue({ displayBrandName: status.restaurantName });
        }

        // Hydrate brand data
        if (status.primaryColor || status.typography || status.description) {
          this.brandGroup.patchValue({
            primaryColor: status.primaryColor || '#BF4444',
            typography: status.typography || 'Inter',
            description: status.description || ''
          });
        }

        // Calculate the furthest step they can be on
        let farthest = 1;

        // If business data exists
        if (status.restaurantName && status.address && status.phone) {
          farthest = 2;

          // If branding data differs from default or has description
          if (status.description || (status.primaryColor && status.primaryColor !== '#BF4444')) {
            farthest = 3;

            if (status.hasMenu) {
              farthest = 4;

              if (status.hasPayment) {
                farthest = 5;
              }
            }
          }
        }

        this.currentStep = farthest;
        this.updateVisualTracker();
      },
      error: (err) => console.error('Failed to load status', err)
    });
  }

  get businessGroup(): FormGroup {
    return this.onboardingForm.get('businessGroup') as FormGroup;
  }

  get brandGroup(): FormGroup {
    return this.onboardingForm.get('brandGroup') as FormGroup;
  }

  get menuGroup(): FormGroup {
    return this.onboardingForm.get('menuGroup') as FormGroup;
  }

  get paymentGroup(): FormGroup {
    return this.onboardingForm.get('paymentGroup') as FormGroup;
  }

  isInvalid(group: FormGroup, field: string): boolean {
    const ctrl = group.get(field);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  setStep(step: number) {
    if (step < 1 || step > this.totalSteps) return;

    // Strict validation: Don't allow clicking past invalid preceding steps
    if (step > this.currentStep) {
      for (let i = this.currentStep; i < step; i++) {
        if (i === 1 && this.businessGroup.invalid) {
          this.businessGroup.markAllAsTouched();
          return;
        }
        if (i === 2 && this.brandGroup.invalid) {
          this.brandGroup.markAllAsTouched();
          return;
        }
        if (i === 3 && this.menuGroup.invalid) {
          this.menuGroup.markAllAsTouched();
          return;
        }
        if (i === 4 && this.paymentGroup.invalid) {
          this.paymentGroup.markAllAsTouched();
          return;
        }
      }
    }

    this.currentStep = step;
    this.updateVisualTracker();
  }

  nextStep(currentFormGroup: FormGroup) {
    if (currentFormGroup.invalid) {
      currentFormGroup.markAllAsTouched();
      return;
    }

    let saveObs = null;
    if (this.currentStep === 1) {
      saveObs = this.onboardingService.saveProfile(this.businessGroup.value);
    } else if (this.currentStep === 2) {
      saveObs = this.onboardingService.saveBranding(this.brandGroup.value);
    } else if (this.currentStep === 3) {
      saveObs = this.onboardingService.saveMenu(this.menuGroup.value);
    } else if (this.currentStep === 4) {
      saveObs = this.onboardingService.savePayments(this.paymentGroup.value);
    }

    if (saveObs) {
      saveObs.subscribe({
        next: () => this.advanceVisualStep(),
        error: (err) => console.error('Failed to save step data', err)
      });
    } else {
      this.advanceVisualStep();
    }
  }

  saveDraft() {
    let saveObs = null;
    if (this.currentStep === 1) {
      if (this.businessGroup.invalid) {
        this.businessGroup.markAllAsTouched();
        return;
      }
      saveObs = this.onboardingService.saveProfile(this.businessGroup.value);
    } else if (this.currentStep === 2) {
      if (this.brandGroup.invalid) {
        this.brandGroup.markAllAsTouched();
        return;
      }
      saveObs = this.onboardingService.saveBranding(this.brandGroup.value);
    } else if (this.currentStep === 3) {
      if (this.menuGroup.invalid) {
        this.menuGroup.markAllAsTouched();
        return;
      }
      saveObs = this.onboardingService.saveMenu(this.menuGroup.value);
    } else if (this.currentStep === 4) {
      if (this.paymentGroup.invalid) {
        this.paymentGroup.markAllAsTouched();
        return;
      }
      saveObs = this.onboardingService.savePayments(this.paymentGroup.value);
    }

    if (saveObs) {
      saveObs.subscribe({
        next: () => {
          // Find standard save draft button and provide feedback visually if needed.
          // For now, logging to console.
          console.log('Draft saved successfully!');
          window.alert('Draft saved successfully!');
        },
        error: (err) => {
          console.error('Failed to save draft', err);
          window.alert('Failed to save draft. Please try again.');
        }
      });
    }
  }

  private advanceVisualStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.updateVisualTracker();
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateVisualTracker();
    }
  }

  private updateVisualTracker() {
    this.steps.forEach(s => {
      if (s.id < this.currentStep) {
        s.status = 'Complete';
      } else if (s.id === this.currentStep) {
        s.status = 'In Progress';
      } else {
        s.status = 'Pending';
      }
    });
  }

  finishSetup() {
    this.onboardingService.publish().subscribe({
      next: () => this.router.navigate(['/merchant/dashboard']),
      error: (err) => {
        console.error('Failed to publish', err);
        // Navigate anyway so user isn't stuck
        this.router.navigate(['/merchant/dashboard']);
      }
    });
  }
}
