import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { MenuService, Menu as AppMenu, MenuCategory } from '../../core/services/menu';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu implements OnInit {
  menuData: AppMenu | null = null;
  isLoading = true;
  error = '';

  categoryForm: FormGroup;
  itemForm: FormGroup;

  showAddCategory = false;
  selectedCategoryId: string | null = null;
  showAddItem = false;

  selectedTabId: string | 'all' = 'all';
  searchTerm = '';

  constructor(private menuService: MenuService, private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      sortOrder: [0, Validators.required]
    });

    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.loadMenu();
  }

  get filteredCategories() {
    if (!this.menuData) return [];
    let cats = this.menuData.categories;
    if (this.selectedTabId !== 'all') {
      cats = cats.filter(c => c.id === this.selectedTabId);
    }
    return cats;
  }

  getFilteredItems(category: MenuCategory) {
    if (!this.searchTerm) return category.items;
    const term = this.searchTerm.toLowerCase();
    return category.items.filter(i =>
      i.name.toLowerCase().includes(term) ||
      (i.description && i.description.toLowerCase().includes(term))
    );
  }

  // Form Validation Helpers
  isInvalid(form: FormGroup, field: string): boolean {
    const ctrl = form.get(field);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  selectTab(tabId: string | 'all') {
    this.selectedTabId = tabId;
  }

  loadMenu(): void {
    this.isLoading = true;
    this.menuService.getMenu().subscribe({
      next: (data) => {
        this.menuData = data;
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 404) {
          this.menuService.createMenu('Kitchen Menu', 'Main store options.').subscribe({
            next: (newMenu) => {
              this.menuData = newMenu;
              this.isLoading = false;
            }
          });
        } else {
          this.error = 'Failed to load menu data from backend.';
          this.isLoading = false;
        }
      }
    });
  }

  onAddCategorySubmit(): void {
    if (this.categoryForm.valid && this.menuData) {
      const { name, description, sortOrder } = this.categoryForm.value;
      this.menuService.addCategory(this.menuData.id, name, description, sortOrder).subscribe({
        next: (cat) => {
          this.menuData?.categories.push({ ...cat, items: [] });
          this.categoryForm.reset({ sortOrder: 0 });
          this.showAddCategory = false;
          this.selectedTabId = cat.id; // Switch to the new category
        },
        error: () => this.error = 'Failed to add category'
      });
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }

  openAddItem(categoryId: string): void {
    this.selectedCategoryId = categoryId;
    this.showAddItem = true;
  }

  onAddItemSubmit(): void {
    if (this.itemForm.valid && this.selectedCategoryId) {
      const { name, description, price } = this.itemForm.value;
      this.menuService.addItem(this.selectedCategoryId, name, description, price).subscribe({
        next: (item) => {
          const cat = this.menuData?.categories.find(c => c.id === this.selectedCategoryId);
          if (cat) cat.items.push(item);
          this.itemForm.reset({ price: 0 });
          this.showAddItem = false;
        },
        error: () => this.error = 'Failed to add item'
      });
    } else {
      this.itemForm.markAllAsTouched();
    }
  }
}

