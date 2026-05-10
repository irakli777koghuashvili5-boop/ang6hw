import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../services/api';

@Component({
  standalone: true,
  selector: 'app-alert',
  imports: [CommonModule],
  templateUrl: './alert.html',
  styleUrl: './alert.scss',
})
export class Alert {
  alertOpen = false;
  message = '';

  constructor(private alertService: Api) {
    this.alertService.alert$.subscribe((data: any) => {
      this.alertOpen = data.open;
      this.message = data.message;
    });
  }

  closeAlert() {
    this.alertService.hide();
  }
}
