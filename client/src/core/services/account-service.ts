import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../types/users'
import { tap } from 'rxjs';
import { RegisterCreds } from '../../types/register-creds';
import { LoginCreds } from '../../types/login-creds';
import { environment } from '../../environments/environment.development';
import { LikesService } from './likes-service';
import { PresenceService } from './presence-service';
import { HubConnectionState } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient)
  private likesService = inject(LikesService)
  private presenceService = inject(PresenceService)
  private baseUrl = environment.apiUrl
  
  currentUser = signal<User | null>(null)

  register(creds: RegisterCreds) {
    //return this.http.post<User>(`${this.baseUrl}/account/register`, creds)

    return this.http.post<User>(`${this.baseUrl}/account/register`, creds, { withCredentials: true}).pipe(
      tap(user => {
        this.setCurrentUser(user)
        this.startTokenRefreshInterval()
      })
    )
  }

  login(creds: LoginCreds) {
    // tap = permite fazer alterações mas sem modificar os dados recebidos
    return this.http.post<User>(`${this.baseUrl}/account/login`, creds, { withCredentials: true}).pipe(
      tap(user => {
        if(user) {
          this.setCurrentUser(user)
          this.startTokenRefreshInterval()
        }
      })
    )
  }

  refreshToken() {
    return this.http.post<User>(this.baseUrl + '/account/refresh-token', {}, {withCredentials: true})
  }

  startTokenRefreshInterval() {
    setInterval(() => {
      this.http.post<User>(this.baseUrl + '/account/refresh-token', {}, {withCredentials: true}).subscribe({
        next: user => this.setCurrentUser(user),
        error: () => {
          this.logout()
        }
      })
    }, 10 * 60 * 1000);
  }

  setCurrentUser(user: User) {
    user.roles = this.getRolesFromToken(user)
    this.currentUser.set(user)
    this.likesService.getLikeIds()

    if (this.presenceService.hubConnection?.state !== HubConnectionState.Connected)
      this.presenceService.createHubConnection(user)
  }

  logout() {
    this.http.post(this.baseUrl + '/account/logout', {}, { withCredentials: true }).subscribe({
      next: () => {
        localStorage.removeItem('filters')
        this.likesService.clearLikeIds()
        this.currentUser.set(null)
        this.presenceService.stopHubConnection()
      }
    })
  }

  private getRolesFromToken(user: User): string[] {
    const payload = user.token.split('.')[1]
    const decoded = atob(payload) // decodific (base64) jwt token
    console.log('token', decoded)
    const jsonPayload = JSON.parse(decoded)
    console.log('jsonPayload', jsonPayload)

    return Array.isArray(jsonPayload.role) ? jsonPayload.role : [jsonPayload.role]
  }
 }
