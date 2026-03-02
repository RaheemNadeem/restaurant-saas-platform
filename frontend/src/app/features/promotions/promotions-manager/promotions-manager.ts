import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export interface Coupon {
  id?: string;
  code: string;
  type: number; // 0 = Percent, 1 = FixedAmount
  discountValue: number;
  maxUses: number;
  currentUses: number;
  validUntil: string;
  isActive: boolean;
}

@Component({
  selector: 'app-promotions-manager',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './promotions-manager.html',
})
export class PromotionsManager implements OnInit {
  coupons: Coupon[] = [];
  isLoading = false;

  newCoupon: Coupon = {
    code: '',
    type: 0,
    discountValue: 0,
    maxUses: 0,
    currentUses: 0,
    validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    isActive: true
  };

  showCreateModal = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadCoupons();
  }

  loadCoupons() {
    this.isLoading = true;
    this.http.get<Coupon[]>(`${environment.apiUrl}/coupons`).subscribe({
      next: (data) => {
        this.coupons = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load coupons', err);
        this.isLoading = false;
      }
    });
  }

  saveCoupon() {
    this.http.post<Coupon>(`${environment.apiUrl}/coupons`, this.newCoupon).subscribe({
      next: (created) => {
        this.coupons.push(created);
        this.showCreateModal = false;
        this.resetForm();
      },
      error: (err) => console.error('Failed to create coupon', err)
    });
  }

  deleteCoupon(id: string) {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    this.http.delete(`${environment.apiUrl}/coupons/${id}`).subscribe({
      next: () => {
        this.coupons = this.coupons.filter(c => c.id !== id);
      },
      error: (err) => console.error('Failed to delete coupon', err)
    });
  }

  resetForm() {
    this.newCoupon = {
      code: '',
      type: 0,
      discountValue: 0,
      maxUses: 0,
      currentUses: 0,
      validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
      isActive: true
    };
  }
}
