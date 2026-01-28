import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private accountService = inject(AccountService)

  init() {
    const userLocalStorage = localStorage.getItem('user')
    if (!userLocalStorage) return of(null)

    const user = JSON.parse(userLocalStorage)
    this.accountService.currentUser.set(user)

    return of(null)
  }
}
