import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Nav } from "../layout/nav/nav";
import { AccountService } from '../core/services/account-service';
import { Home } from "../features/home/home";
import { User } from '../types/users';
//import { Register } from "../features/account/register/register";

@Component({
  selector: 'app-root',
  imports: [Nav, Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private http = inject(HttpClient)
  private accountService = inject(AccountService)

  protected readonly title = 'Dating App'
  protected members = signal<User[]>([])

  async ngOnInit() {
    this.members.set(await this.getMembers())
    this.setCurrentUser()
    console.log('app-ts::members', this.members())
  }

  setCurrentUser(): void {
    const userLocalStorage = localStorage.getItem('user')
    if (!userLocalStorage) return

    const user = JSON.parse(userLocalStorage)
    this.accountService.currentUser.set(user)
  }

  async getMembers() {
    try {
      // novo jeito de retornar uma promise
      return lastValueFrom(this.http.get<User[]>('https://localhost:5001/api/members'))
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
