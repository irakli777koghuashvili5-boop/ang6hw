import { ChangeDetectorRef, Component } from '@angular/core';
import { Api } from '../services/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  constructor(private api: Api, private cdr: ChangeDetectorRef) {}
  ImageForHeader: any;
  currentYear: number = new Date().getFullYear();
  

  ngOnInit() {
    this.api.getAll(`qrcode`).subscribe((res) => {
      console.log(res);
      this.ImageForHeader = res;
      this.cdr.detectChanges();
    });
  }
 
}
