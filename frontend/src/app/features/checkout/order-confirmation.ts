import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
    selector: 'app-order-confirmation',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './order-confirmation.html',
    styleUrl: './order-confirmation.scss'
})
export class OrderConfirmation implements OnInit {
    orderNumber: string | null = null;
    estimatedWait = '15-25';

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.orderNumber = this.route.snapshot.queryParamMap.get('orderNumber');
    }
}
