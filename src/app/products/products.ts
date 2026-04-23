import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
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
export class Products {

  addToCart(id: string){
    this.api
      .postAllHeader(`shop/cart/product`, {
        id: id,
        quantity: 1,
      })
      .subscribe({
        next: (res) => {
          console.log(res);
          alert('cart created and product added!');
          this.cdr.detectChanges();
        },
        error: (err) => console.log(err),
      });
  }

  getStars(rating: number): string {
    const validRating = Math.max(0, rating || 0);
    const filledStars = '⭐'.repeat(validRating);
    const emptyStars = '☆'.repeat(5 - validRating);
    return filledStars + emptyStars;
  }

  carouselImages: string[] = [
    'https://imgstore.alta.ge/images/b9a2676e-f771-4c0c-a4a4-c22f2be77bf61e707548-c487-4906-b655-dce76ab55d99.jpeg',
    'https://imgstore.alta.ge/images/51234eed-cdc6-48a5-9939-7ce2d9bada99d1700f8e-e42f-472d-baf7-ad117db20341.jpeg',
    'https://imgstore.alta.ge/images/245546b4-46ca-417b-b980-3695a92b807fa11a5bf3-fc10-454c-8311-dcb6af92239d.png',
    'https://imgstore.alta.ge/images/3917999c-b426-44a3-9bbe-f1b33c394024c8b5ddc4-b3af-4908-b3a8-fe57aba6ccc6.png',
  ];

  currentSlide: number = 0;
  carouselInterval: any;
  isLoading: boolean = true;

  startAutoPlay() {
    this.carouselInterval = setInterval(() => {
      this.nextSlide();
    }, 2000);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.carouselImages.length;
  }

  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.carouselImages.length) % this.carouselImages.length;
  }

  setSlide(index: number) {
    this.currentSlide = index;
    clearInterval(this.carouselInterval);
    this.startAutoPlay();
  }

  ngOnDestroy() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }
  minPrice: number = 1;
  maxPrice: number = 10000;
  options: Options = {
    floor: 1,
    ceil: 10000,
    translate: (value: number): string => '$' + value,
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
  limit: number = 12;
  total: number = 4;
  totalPages = this.total;
  currentPage: number = 1;

  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.initialLoad();
    this.startAutoPlay();
  }

  initialLoad() {
    this.isLoading = true;
    this.api
      .getAll(`shop/products/all?page_index=${this.currentPage}&page_size=${this.selectedValue}`)
      .subscribe((res: any) => {
        this.products = res.products;
        this.api.getAll(`shop/products/brands`).subscribe((resBr: any) => {
          this.newArrOfBr = resBr || [];
          this.isLoading = false;
          this.cdr.detectChanges();
        });

        this.api.getAll(`shop/products/categories`).subscribe((resCat: any) => {
          this.tempArrOfObj = resCat;
          this.cdr.detectChanges();
        });
      });
  }

  loadProducts() {
    this.isLoading = true;

    this.api
      .getAll(`shop/products/all?page_index=${this.currentPage}&page_size=${this.selectedValue}`)
      .subscribe((res: any) => {
        this.products = res.products;
        this.total = res.total;
        this.totalPages = Math.ceil(res.total / res.limit);
        this.limit = res.limit;
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }

  giveFilter() {
    this.isLoading = true;

    let params: any = {
      page_index: this.currentPage,
      page_size: this.selectedValue,
      keywords: this.keywords,
      category_id: this.selectedCategories,
      brand: this.selectedBrand !== 'all' ? this.selectedBrand : null,
      price_min: this.minPrice,
      price_max: this.maxPrice,
      sort_by: 'price',
      sort_direction: this.selectedOrder,
    };

    Object.keys(params).forEach((key) => {
      if (
        params[key] === null ||
        params[key] === undefined ||
        params[key] === '' ||
        params[key].length === 0
      ) {1
        delete params[key];
      }
    });

    let queryString = new URLSearchParams(params).toString();

    this.api.getAll(`shop/products/search?${queryString}`).subscribe((res: any) => {
      this.products = res.products;
      this.totalPages = Math.ceil(res.total / res.limit);
      this.total = res.total;
      this.limit = res.limit;
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }
  resetFilters() {
    this.loadProducts();
  }

  onSortChange() {
    this.currentPage = 1;
    this.giveFilter();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.giveFilter();
  }

  onCategoryChange(event: Event, item: any) {
    let checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedCategories.push(item.id);
    } else {
      this.selectedCategories = this.selectedCategories.filter((id) => id !== item.id);
    }
  }

  get pages(): number[] {
    let start = Math.max(1, this.currentPage - 2);
    let end = Math.min(this.totalPages, this.currentPage + 2);
    let pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
  isFilteringActive(): boolean {
    return (
      this.keywords !== '' ||
      this.selectedCategories.length > 0 ||
      this.selectedBrand !== 'all' ||
      this.minPrice !== 1 ||
      this.maxPrice !== 10000
    );
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;

      if (this.isFilteringActive()) {
        this.giveFilter();
      } else {
        this.loadProducts();
      }
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
  isVisible = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isVisible = window.scrollY > 500;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  isFilterOpen = false;
  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }
}