import { Inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Api } from '../services/api';

export const guardGuard: CanActivateFn = (route, state) => {
  let api = Inject(Api)
  let router = Inject(Router)

  
  if (!localStorage.getItem('access_token')) {
    api.show(`Log In First!`)
    router.navigateByUrl(`/sign-in`)
    return false;
  }

  return true;
};
