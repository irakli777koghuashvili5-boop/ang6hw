import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { Api } from '../services/api';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, NgxSliderModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  minPrice: number = 0;
  maxPrice: number = 10000;
  options: Options = {
    floor: 0,
    ceil: 10000,
    translate: (value: number): string => '$' + value
  };

  products: any[] = [];
  newArrOfBr: any[] = [];
  tempArrOfObj: any[] = [];
  TheFiltredProductsByEverything: any = {};
  
  keywords: string = '';
  selectedValue: string = '12';
  selectedBrand: string = 'all';
  selectedCategories: number[] = [];
  selectedOrder: string = 'asc';

  totalPages: number = 4;
  currentPage: number = 1;

  constructor(private api: Api, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.initialLoad();
  }

  initialLoad() {
    this.api.getAll(`shop/products/all?page_index=${this.currentPage}&page_size=${this.selectedValue}`)
      .subscribe((res: any) => {
        this.products = res.products;
        this.cdr.detectChanges();

        this.api.getAll(`shop/products/brands`).subscribe((resBr: any) => {
          this.newArrOfBr = resBr || [];
          this.cdr.detectChanges();
        });

        this.api.getAll(`shop/products/categories`).subscribe((resCat: any) => {
          this.tempArrOfObj = resCat;
          this.cdr.detectChanges();
        });
      });
  }

  loadProducts() {
    this.api.getAll(`shop/products/all?page_index=${this.currentPage}&page_size=${this.selectedValue}`)
      .subscribe({
        next: (res: any) => {
          this.products = res.products;
          this.cdr.detectChanges();
        },
      });
  }

  giveFilter() {
    const params: any = {
      page_index: this.currentPage,
      page_size: this.selectedValue,
      keywords: this.keywords,
      category_id: Number(this.selectedCategories),
      brand: this.selectedBrand !== 'all' ? this.selectedBrand : null,
      price_min: this.minPrice,
      price_max: this.maxPrice,
      sort_direction: this.selectedOrder
    };

    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === undefined || params[key] === '' || params[key].length === 0) {
        delete params[key];
      }
    });

    const queryString = new URLSearchParams(params).toString();

    this.api.getAll(`shop/products/search?${queryString}`)
      .subscribe((res: any) => {
        this.products = res.products;
        this.TheFiltredProductsByEverything = res;
        this.cdr.detectChanges();
      });
  }

  resetFilters() {
    this.loadProducts();
  }

  onSelectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedValue = target.value;
    this.cdr.detectChanges();
  }

  onCategoryChange(event: Event, item: any) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedCategories.push(item.id);
    } else {
      this.selectedCategories = this.selectedCategories.filter(id => id !== item.id);
    }
  }

  get pages(): number[] {
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
      this.cdr.detectChanges();
    }
  }

  goToFirst() {
    this.goToPage(1);
  }

  goToLast() {
    this.goToPage(this.totalPages);
  }

  goToPrevious() {
    this.goToPage(this.currentPage - 1);
  }

  goToNext() {
    this.goToPage(this.currentPage + 1);
  }
}