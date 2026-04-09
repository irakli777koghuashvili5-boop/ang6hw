import { ChangeDetectorRef, Component } from '@angular/core';
import { Api } from '../services/api';
import { FormsModule } from '@angular/forms';
import { CommonModule} from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-products',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {  
  minPrice: number = 0;
  maxPrice: number = 10000;

onCount = 1;

nextN() {
  this.onCount++;
  console.log(this.onCount);
}
prevN() {
  if (this.onCount > 1) {
    this.onCount--;
  }
  console.log(this.onCount);
}
  constructor(private api : Api,private  cdr : ChangeDetectorRef) {}
  keywords: string = '';
  products: any;
  productBtn: any;
  totalPages: number = 4; 
  currentPage: number = 1;   
  selectedValue: string = '12'  
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
  this.currentPage = 1;
  this.loadProducts();
  this.cdr.detectChanges();
}
goToLast() {
  this.currentPage = this.totalPages;
  this.loadProducts();
  this.cdr.detectChanges();
}
goToPrevious() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.loadProducts();
    this.cdr.detectChanges();
  }
}
goToNext() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.loadProducts();
    this.cdr.detectChanges();
  }
}
  onSelectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedValue = target.value;
    console.log('Selected:', this.selectedValue);
    this.cdr.detectChanges();
  }
newArrOfBr = [];
tempArrOfObj:any = [];
TheFiltredProductsByEverything = {}
selectedBrand: string = 'all'


giveFilter() {
  
  const params: any = {
    page_index: this.currentPage,
    page_size: this.selectedValue,
    keywords: this.keywords,
    category_id:Number(this.selectedCategories),    
    brand: this.selectedBrand !== 'all' ? this.selectedBrand : null,
    // rating:null,
    price_min: this.minPrice,
    price_max: this.maxPrice,
    // sort_by: null,
    sort_direction: this.selectedOrder
  };

  Object.keys(params).forEach(key => {
    if (params[key] === null || params[key] === undefined || params[key] === ''|| params[key].length === 0) {
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


    ngOnInit() {
    this.api.getAll(`shop/products/all?page_index=${this.currentPage}&page_size=${this.selectedValue}`).subscribe((res: any) => {
    this.products = res.products;
    this.cdr.detectChanges();
    this.api.getAll(`shop/products/brands`).subscribe((res: any) => {;    
      this.newArrOfBr = res || [];
      console.log(this.newArrOfBr);
       this.cdr.detectChanges();
    });
    this.api.getAll(`shop/products/categories`).subscribe((res: any) => {;    
      this.tempArrOfObj = res;
      console.log(this.tempArrOfObj);
       this.cdr.detectChanges();
    })
  })

  

}

  loadProducts() {
  this.api.getAll(
    `shop/products/all?page_index=${this.currentPage}&page_size=${this.selectedValue}`
  ).subscribe({
    next: (res: any) => {
      this.products = res.products; 
      console.log('Products:', this.products);
      this.cdr.detectChanges();
    },
  });
}


  selectedCategories: number[] = [];
  selectedOrder: string = 'asc';
  

  onCategoryChange(event: Event, item: any) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedCategories.push(item.id);
    } else {
      this.selectedCategories = this.selectedCategories.filter(id => id !== item.id);
    }
    console.log('Selected IDs:', this.selectedCategories);
  }

  resetFilters() {
    this.api.getAll(`shop/products/all?page_index=${this.currentPage}&page_size=${this.selectedValue}`).subscribe((res: any) => {
    this.products = res.products;
    console.log(this.products);
    this.cdr.detectChanges();
  });


}


}