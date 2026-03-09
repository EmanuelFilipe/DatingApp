import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../types/users'
import { tap } from 'rxjs';
import { RegisterCreds } from '../../types/register-creds';
import { LoginCreds } from '../../types/login-creds';
import { environment } from '../../environments/environment.development';
import { LikesService } from './likes-service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient)
  private likesService = inject(LikesService)
  private baseUrl = environment.apiUrl
  
  currentUser = signal<User | null>(null)

  register(creds: RegisterCreds) {
    //return this.http.post<User>(`${this.baseUrl}/account/register`, creds)

    return this.http.post<User>(`${this.baseUrl}/account/register`, creds).pipe(
      tap(user => {
        this.setCurrentUser(user)
      })
    )
  }

  login(creds: LoginCreds) {
    // tap = permite fazer alterações mas sem modificar os dados recebidos
    return this.http.post<User>(`${this.baseUrl}/account/login`, creds).pipe(
      tap(user => {
        debugger
        if(user)
          this.setCurrentUser(user)
      })
    )
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user))
    this.currentUser.set(user)
    this.likesService.getLikeIds()
  }

  logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('filters')
    this.likesService.clearLikeIds()
    this.currentUser.set(null)
  }

}
