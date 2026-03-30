import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { ToastService } from '../../core/services/toast-service';
import { themes } from '../theme';
import { HasRole } from '../../shared/directives/has-role';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive, HasRole],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit {
  private router = inject(Router)
  private toast = inject(ToastService)
  protected loading = signal(false)
  protected accountService = inject(AccountService)
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
    this.loading.set(true)
    this.accountService.login(this.creds).subscribe({
      next: () => {
        this.toast.success('Logged in successfully!')
        this.creds = {}
        this.router.navigateByUrl('/members')
      },
      error: error => {
        this.toast.error(error.error)
      },
      complete: () => this.loading.set(false)
    })
  }

  logout(): void {
    this.accountService.logout()
    this.router.navigateByUrl('/')
  }

  handleSelectTheme(theme: string) {
    this.selectedTheme.set(theme)
    localStorage.setItem('theme', theme)

    // set theme on browser
    document.documentElement.setAttribute('data-theme', theme)

    // closing dropdown after click on any element
    const element = document.activeElement as HTMLDivElement
    if (element) element.blur()
  }

  handleSelectUserItem() {
    // closing dropdown after click on any element
    const element = document.activeElement as HTMLDivElement
    if (element) element.blur()
  }
}
