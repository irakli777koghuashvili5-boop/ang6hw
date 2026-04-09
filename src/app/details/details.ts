
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Api } from '../services/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  templateUrl: './details.html',
  styleUrls: ['./details.scss'],
  imports: [CommonModule],
})
export class Details {
  selectedId: number = 0;
  productArr: any[] = [];
  ratingsArr: any[] = [];
  images: string[] = [];

  currentIndex: number = 0;

  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
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
    });
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
}
