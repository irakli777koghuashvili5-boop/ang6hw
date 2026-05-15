import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../services/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  templateUrl: './details.html',
  styleUrls: ['./details.scss'],
  imports: [CommonModule, FormsModule],
})
export class Details {
  selectedId: string = '';
  productArr: any[] = [];
  ratingsArr: any[] = [];
  images: string[] = [];
  quotesArr: any[] = [];
  arrOfCart: any = {};
  comment: any;
  getStars(rating: number): string {
    const validRating = Math.max(0, rating || 0);
    const filledStars = '⭐'.repeat(validRating);
    const emptyStars = '☆'.repeat(5 - validRating);
    return filledStars + emptyStars;
  }
  currentIndex: number = 0;
  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe((params) => {
      this.selectedId = params['id'];
      console.log('Selected ID:', this.selectedId);
    });
  }
  ngOnInit() {
    this.api.getAll(`shop/products/id/${this.selectedId}`).subscribe((res: any) => {
      this.productArr = Object.entries(res).map(([_, value]) => value as any);
      this.ratingsArr = res.ratings || [];
      this.images = res.images || [];
      console.log('Product array:', this.productArr);
      console.log('Ratings:', this.ratingsArr);
      console.log('Images:', this.images);
      this.cdr.detectChanges();
      this.productArr[12].forEach((item: any, index: number) => {
        this.api.getAll(`quote/random`).subscribe({
          next: (res) => {
            this.quotesArr[index] = res;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.log(`error: ` + err);
          },
        });
      });
    });
    this.getFromCart();
  }
  get currentImage(): string {
    return this.images[this.currentIndex];
  }
  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }
  prevImage(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }
  setIndex(index: number): void {
    this.currentIndex = index;
  }
  getArrLength: any = 0;
  getFromCart() {
    this.api
      .getAllHeader('shop/cart', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.getArrLength = res.products.length;
          this.arrOfCart = res;
          this.cdr.detectChanges();
          console.log(this.getArrLength);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  addToCart() {
    const currentId = String(this.selectedId).trim();

    if (this.getArrLength === 0) {
      this.api
        .postAllHeader(`shop/cart/product`, {
          id: currentId,
          quantity: 1,
        })
        .subscribe({
          next: (res) => {
            this.api.show('cart created and product added!');
            this.getFromCart(); 
          },
          error: (err) => {
            if(err.status === 401){
              this.api.show("Log in First")
            }
            console.error(err);
          },
        });
    }

    else {
      let existingProduct = this.arrOfCart.products.find(
        (item: any) => item.productId === currentId,
      );
      this.api
        .patchData(`shop/cart/product`, {
          id: currentId,
          quantity: existingProduct ? existingProduct.quantity + 1 : 1,
        })
        .subscribe({
          next: (res) => {
            this.api.show(existingProduct ? 'Quantity updated' : 'New product added to cart');
            this.getFromCart();
          },
          error: (err) => {
            console.log('Patch failed:', err);
          },
        });
    }
  }
  isReviewPopupOpen: boolean = false;
  reviewData = {
    comment: '',
    category: 'Game',
  };

  openReviewPopup() {
    this.isReviewPopupOpen = true;
  }

  closeReviewPopup() {
    this.isReviewPopupOpen = false;
    this.reviewData = { comment: '', category: 'Game' };
  }

  submitReview() {
    console.log('Review Submitted:', this.reviewData);
    this.api
      .postAllHeader(`quote`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')} `,
        },
        body: {
          author: localStorage.getItem(`firstName`),
          quote: this.reviewData.comment,
          type: this.reviewData.category,
        },
      })
      .subscribe({
        next: (res) => console.log(res),
        error: (err) => console.log(err),
      });

    this.closeReviewPopup();
  }
}
