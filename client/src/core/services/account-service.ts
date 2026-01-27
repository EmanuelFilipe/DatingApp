import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../types/users'
import { tap } from 'rxjs';
import { RegisterCreds } from '../../types/register-creds';
import { LoginCreds } from '../../types/login-creds';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient)
  protected baseUrl = 'https://localhost:5001/api'
  currentUser = signal<User | null>(null)

  register(creds: RegisterCreds) {
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
        this.setCurrentUser(user)
      })
    )
  }

  setCurrentUser(user: User) {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
      this.currentUser.set(user)
    }
  }

  logout() {
    localStorage.removeItem('user')
    this.currentUser.set(null)
  }
}
