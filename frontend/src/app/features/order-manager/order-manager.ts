import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, Order } from '../../core/services/order.service';
import { interval, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-order-manager',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './order-manager.html',
    styleUrls: ['./order-manager.scss']
})
export class OrderManagerComponent implements OnInit, OnDestroy {
    orders: Order[] = [];
    selectedOrder: Order | null = null;
    searchTerm: string = '';
    showArchive: boolean = false;
    loading = false;
    now = new Date();
    private pollSubscription?: Subscription;
    private timerSubscription?: Subscription;

    constructor(private orderService: OrderService) { }

    ngOnInit(): void {
        this.startPolling();
        this.timerSubscription = interval(60000).subscribe(() => this.now = new Date());
    }

    ngOnDestroy(): void {
        this.pollSubscription?.unsubscribe();
        this.timerSubscription?.unsubscribe();
    }

    startPolling(): void {
        // Poll every 10 seconds for new orders
        this.pollSubscription = interval(10000)
            .pipe(
                startWith(0),
                switchMap(() => {
                    this.loading = true;
                    return this.orderService.getOrders();
                })
            )
            .subscribe({
                next: (orders) => {
                    this.orders = orders.sort((a, b) =>
                        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    );
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Failed to fetch orders:', err);
                    this.loading = false;
                }
            });
    }

    getElapsedMinutes(createdAt: string): number {
        // Ensure we compare UTC to UTC or Local to Local
        const orderDate = new Date(createdAt);
        const elapsed = new Date().getTime() - orderDate.getTime();
        return Math.floor(elapsed / 60000);
    }

    getUrgencyClass(createdAt: string): string {
        const mins = this.getElapsedMinutes(createdAt);
        if (mins >= 20) return 'text-red-600 font-bold animate-pulse';
        if (mins >= 10) return 'text-orange-500 font-bold';
        return 'text-gray-400 font-medium';
    }

    refreshOrders(): void {
        this.loading = true;
        this.orderService.getOrders().subscribe({
            next: (orders) => {
                this.orders = orders;
                this.loading = false;
            },
            error: () => (this.loading = false)
        });
    }

    getFilteredOrders(status: string): Order[] {
        let filtered = this.orders.filter(o => o.status === status);
        if (this.searchTerm) {
            const search = this.searchTerm.toLowerCase();
            filtered = filtered.filter(o =>
                o.orderNumber.toLowerCase().includes(search) ||
                o.customerName.toLowerCase().includes(search)
            );
        }
        return filtered;
    }

    getOrdersByStatus(status: string): Order[] {
        return this.getFilteredOrders(status);
    }

    printReceipt(order: Order): void {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <div style="font-family: monospace; width: 300px; padding: 20px; border: 1px dashed #ccc;">
                    <h2 style="text-align: center;">QUICKSERVE</h2>
                    <p style="text-align: center;">Order: #${order.orderNumber}</p>
                    <hr/>
                    <p>Customer: ${order.customerName}</p>
                    <p>Time: ${new Date(order.createdAt).toLocaleString()}</p>
                    <hr/>
                    ${order.items.map(i => `<p>${i.quantity}x ${i.name} - $${i.price}</p>`).join('')}
                    <hr/>
                    <p style="font-weight: bold;">TOTAL: $${order.total}</p>
                    <p style="text-align: center; margin-top: 20px;">Prepared with love.</p>
                </div>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    }

    selectOrder(order: Order): void {
        this.selectedOrder = order;
    }

    updateStatus(order: Order, newStatus: string): void {
        this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
            next: () => {
                order.status = newStatus;
                if (this.selectedOrder?.id === order.id) {
                    this.selectedOrder.status = newStatus;
                }
            },
            error: (err) => console.error('Failed to update status:', err)
        });
    }
}
