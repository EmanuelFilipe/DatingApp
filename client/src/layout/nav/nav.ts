import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  protected accountService = inject(AccountService)
  protected creds: any = {}
  // como funciona esse signal?
  // quando precisa notificar um componente de que algo mudou
  //protected loggedIn = signal(false) 

  login(): void {
    this.accountService.login(this.creds).subscribe({
      next: response => {
        console.log(response),
        //this.loggedIn.set(true)
        this.creds = {}
      },
      error: error => alert(error.message)
    })
  }

  logout(): void {
    this.accountService.logout()
    //this.loggedIn.set(false)
  }
}
