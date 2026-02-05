import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { ToastService } from '../../core/services/toast-service';
import { themes } from '../theme';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit {

  protected accountService = inject(AccountService)
  private router = inject(Router)
  private toast = inject(ToastService)

  protected creds: any = {}
  protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'light')
  protected avaliableThemes = themes
  // como funciona esse signal?
  // quando precisa notificar um componente de que algo mudou
  //protected loggedIn = signal(false) 

  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme', this.selectedTheme())
  }

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

  handleSelectTheme(theme: string) {
    this.selectedTheme.set(theme)
    localStorage.setItem('theme', theme)

    //set theme on browser
    document.documentElement.setAttribute('data-theme', theme)

    // closing dropdown after click o n any element
    const element = document.activeElement as HTMLDivElement
    if (element) element.blur()
  }
}
