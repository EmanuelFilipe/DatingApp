import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service';
import { tap } from 'rxjs';
import { LikesService } from './likes-service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private accountService = inject(AccountService)
  private likesService = inject(LikesService)

  init() {
    return this.accountService.refreshToken().pipe(
      tap(user => {
        if (user) {
          this.accountService.setCurrentUser(user)
          this.accountService.startTokenRefreshInterval()
        }
      })
    )    
  }

  // init() {
  //   const userLocalStorage = localStorage.getItem('user')
  //   if (!userLocalStorage) return of(null)

  //   const user = JSON.parse(userLocalStorage)
  //   this.accountService.currentUser.set(user)
  //   this.likesService.getLikeIds()

  //   return of(null)
  // }
}
