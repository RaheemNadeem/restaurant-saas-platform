import { TestBed } from '@angular/core/testing';
import { CartService, CartItem } from './cart.service';

describe('CartService', () => {
    let service: CartService;

    beforeEach(() => {
        // Clear localStorage before each test to prevent state leakage
        localStorage.removeItem('quickserve_cart');
        TestBed.configureTestingModule({});
        service = TestBed.inject(CartService);
    });

    afterEach(() => {
        localStorage.removeItem('quickserve_cart');
    });

    const mockItem = {
        id: 'item-1',
        name: 'Chicken Shawarma',
        description: 'Grilled chicken with tahini',
        price: 12.99,
        categoryId: 'cat-1',
        isAvailable: true
    };

    const anotherItem = {
        id: 'item-2',
        name: 'Falafel Wrap',
        description: 'Crispy falafel',
        price: 9.99,
        categoryId: 'cat-1',
        isAvailable: true
    };

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should start with an empty cart', () => {
        const summary = service.getSummary();
        expect(summary.items.length).toBe(0);
        expect(summary.subtotal).toBe(0);
        expect(summary.itemCount).toBe(0);
    });

    // ─── addItem ─────────────────────────────────────────────────────────────

    it('should add a new item with quantity 1', () => {
        service.addItem(mockItem);
        const summary = service.getSummary();
        expect(summary.items.length).toBe(1);
        expect(summary.items[0].quantity).toBe(1);
        expect(summary.itemCount).toBe(1);
    });

    it('should increment quantity when adding the same item twice', () => {
        service.addItem(mockItem);
        service.addItem(mockItem);
        const summary = service.getSummary();
        expect(summary.items.length).toBe(1);
        expect(summary.items[0].quantity).toBe(2);
        expect(summary.itemCount).toBe(2);
    });

    it('should track multiple distinct items', () => {
        service.addItem(mockItem);
        service.addItem(anotherItem);
        const summary = service.getSummary();
        expect(summary.items.length).toBe(2);
        expect(summary.itemCount).toBe(2);
    });

    // ─── removeItem ──────────────────────────────────────────────────────────

    it('should decrement quantity when removing an item with quantity > 1', () => {
        service.addItem(mockItem);
        service.addItem(mockItem);
        service.removeItem(mockItem.id);
        const summary = service.getSummary();
        expect(summary.items.length).toBe(1);
        expect(summary.items[0].quantity).toBe(1);
    });

    it('should remove the item entirely when quantity reaches 0', () => {
        service.addItem(mockItem);
        service.removeItem(mockItem.id);
        const summary = service.getSummary();
        expect(summary.items.length).toBe(0);
    });

    it('should not affect other items when removing one', () => {
        service.addItem(mockItem);
        service.addItem(anotherItem);
        service.removeItem(mockItem.id);
        const summary = service.getSummary();
        expect(summary.items.length).toBe(1);
        expect(summary.items[0].id).toBe('item-2');
    });

    // ─── clearCart ────────────────────────────────────────────────────────────

    it('should empty the cart completely', () => {
        service.addItem(mockItem);
        service.addItem(anotherItem);
        service.clearCart();
        const summary = service.getSummary();
        expect(summary.items.length).toBe(0);
        expect(summary.subtotal).toBe(0);
        expect(summary.itemCount).toBe(0);
    });

    // ─── Subtotal calculation ────────────────────────────────────────────────

    it('should calculate subtotal correctly for mixed quantities', () => {
        service.addItem(mockItem);     // 12.99 x 1
        service.addItem(mockItem);     // 12.99 x 2
        service.addItem(anotherItem);  // 9.99  x 1
        const summary = service.getSummary();
        const expected = (12.99 * 2) + (9.99 * 1);
        expect(summary.subtotal).toBeCloseTo(expected, 2);
    });

    // ─── localStorage persistence ────────────────────────────────────────────

    it('should persist cart to localStorage', () => {
        service.addItem(mockItem);
        const raw = localStorage.getItem('quickserve_cart');
        expect(raw).toBeTruthy();
        const parsed = JSON.parse(raw!);
        expect(parsed.length).toBe(1);
        expect(parsed[0].name).toBe('Chicken Shawarma');
    });

    it('should restore cart from localStorage on re-init', () => {
        service.addItem(mockItem);
        service.addItem(anotherItem);

        // Create a new instance (simulates page reload)
        const newService = new CartService();
        const summary = newService.getSummary();
        expect(summary.items.length).toBe(2);
        expect(summary.itemCount).toBe(2);
    });

    // ─── Observable emissions ────────────────────────────────────────────────

    it('should emit changes through getCart() observable', (done) => {
        const emissions: CartItem[][] = [];

        service.getCart().subscribe(items => {
            emissions.push(items);
            if (emissions.length === 2) {
                // First emission is the initial empty state, second is after addItem
                expect(emissions[1].length).toBe(1);
                expect(emissions[1][0].name).toBe('Chicken Shawarma');
                done();
            }
        });

        service.addItem(mockItem);
    });
});
