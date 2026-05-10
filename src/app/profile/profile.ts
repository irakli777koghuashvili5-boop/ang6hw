import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../services/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  tab = 'details';
  arrOfProfile: any = {};
  oldPassword = '';
  newPassword = '';
  showPopup = false;
  showEditPopup = false;

  arrOfCart: any = {};
  elId: string = ``;
  arrOfItem: any = {};

  // 1. ADDED: This is the new array that holds the combined data for the HTML loop
  cartItemsWithDetails: any[] = [];

  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef,
    private x: Router,
  ) {}

  ngOnInit() {
    this.api
      .getAllHeader(`auth`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')} `,
        },
      })
      .subscribe((res) => {
        console.log(res);
        this.arrOfProfile = res;
        this.cdr.detectChanges();
      });

    this.loadCartAndProduct();
  }

  loadCartAndProduct() {
    this.api
      .getAllHeader('shop/cart', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .subscribe({
        next: (cartRes: any) => {
          this.arrOfCart = cartRes;
          this.cartItemsWithDetails = [];
          console.log('Cart Loaded:', cartRes);

          if (cartRes.products && cartRes.products.length > 0) {
            cartRes.products.forEach((item: any) => {
              this.api.getAll(`shop/products/id/${item.productId}`).subscribe({
                next: (productDetails: any) => {
                  this.cartItemsWithDetails.push({
                    ...productDetails,
                    cartQuantity: item.quantity,
                    pricePerQuantity: item.pricePerQuantity,
                  });
                  console.log(item.quantity);

                  this.cdr.detectChanges();
                },
                error: (err) => console.error('Product Detail Error:', err),
              });
            });
          } else {
            this.cdr.detectChanges();
          }
        },
        error: (err) => console.error('Cart Error:', err),
      });
  }

  updateQty(productId: string, change: number) {
    const item = this.cartItemsWithDetails.find((i) => i._id === productId);
    if (item) {
      const newQuantity = item.cartQuantity + change;
      let body = {
        id: productId,
        quantity: newQuantity,
      };
      if (newQuantity < 1) return;
      this.api.patchData(`shop/cart/product`, body).subscribe({
        next: (res: any) => {
          item.cartQuantity = newQuantity;
          console.log(res);

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to update quantity', err);
          this.api.show('Could not update quantity. Please try again.');
        },
      });
    }
  }
  deleteItem(id: string) {
    this.api.deleteDatas(`shop/cart/product`, { id: id }).subscribe({
      next: (res) => {
        console.log(res);

        this.loadCartAndProduct();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('delete fail:', err);
      },
    });
  }
  deleteCart() {
    this.api.deleteData(`shop/cart`, {}).subscribe({
      next: (res) => {
        console.log(res);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Delete cart failed:', err);
      },
    });
  }
checkOut(){
  this.api.postAllHeader('shop/cart/checkout', {}).subscribe({
    next: (res => {
      this.api.show(`succesfully checked out`)
      this.loadCartAndProduct();
      this.cdr.detectChanges()
    }),
    error: (err => console.log(err))
  })
}

  logOutFn() {
    this.api.show('Logged out successfully');
    localStorage.removeItem(`access_token`);
    localStorage.removeItem(`firstName`);
    localStorage.removeItem(`userId`);
    localStorage.removeItem(`refresh_token`);
    window.location.href = '/sign-in';
  }

  changePass() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No token found. User is not logged in.');
      return;
    }
    const apiUrl = 'auth/change_password';
    this.api
      .patchData(apiUrl, {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      })
      .subscribe({
        next: (res) => {
          this.api.show('Password changed successfully:');
          this.oldPassword = '';
          this.newPassword = '';
          this.showPopup = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to change password:', err);
        },
      });
  }

  updateProfile() {
    const apiurl = `auth/update`;
    this.api.patchData(apiurl, this.arrOfProfile).subscribe({
      next: (res) => {
        this.api.show('Profile updated successfully');
        this.showEditPopup = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Update failed:', err);
        this.api.show('Failed to update profile');
      },
    });
  }

  deleteAcc() {
    const apiurL = `auth/delete`;
    this.api.deleteData(apiurL, this.arrOfProfile).subscribe({
      next: (res) => {
        this.api.show('Account deleted successfully');
        this.cdr.detectChanges();
        localStorage.removeItem(`access_token`);
        localStorage.removeItem(`refresh_token`);
        localStorage.removeItem(`firstName`);
        localStorage.removeItem(`userId`);
        window.location.href = '/sign-in';
      },
      error: (err) => {
        console.error('Delete failed:', err);
        this.api.show('Failed to delete account');
      },
    });
  }
}
