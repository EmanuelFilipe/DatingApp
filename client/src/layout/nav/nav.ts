import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  protected accountService = inject(AccountService)
  private router = inject(Router)
  private toast = inject(ToastService)

  protected creds: any = {}
  // como funciona esse signal?
  // quando precisa notificar um componente de que algo mudou
  //protected loggedIn = signal(false) 

  login(): void {
    this.accountService.login(this.creds).subscribe({
      next: response => {
        this.toast.success('Logged in successfully!')
        this.creds = {}
        this.router.navigateByUrl('/members')
      },
      error: error => {
        this.toast.error(error.error)
      }
    })
  }

  logout(): void {
    this.accountService.logout()
    this.router.navigateByUrl('/')
  }
}
