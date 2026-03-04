import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Menu {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  categories: MenuCategory[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = `${environment.apiUrl}/menu`;

  constructor(private http: HttpClient) { }

  private getHeaders() {
    // Mocking the tenant ID until Auth workflow is finalized
    return new HttpHeaders({
      'X-Tenant-Id': 'tenant-demo-1'
    });
  }

  getMenu(): Observable<Menu> {
    return this.http.get<Menu>(this.apiUrl, { headers: this.getHeaders() });
  }

  createMenu(title: string, description: string): Observable<Menu> {
    return this.http.post<Menu>(this.apiUrl, { title, description }, { headers: this.getHeaders() });
  }

  addCategory(menuId: string, name: string, description: string, sortOrder: number): Observable<MenuCategory> {
    return this.http.post<MenuCategory>(`${this.apiUrl}/${menuId}/categories`, { name, description, sortOrder }, { headers: this.getHeaders() });
  }

  addItem(categoryId: string, name: string, description: string, price: number): Observable<MenuItem> {
    return this.http.post<MenuItem>(`${this.apiUrl}/categories/${categoryId}/items`, { name, description, price }, { headers: this.getHeaders() });
  }
}
