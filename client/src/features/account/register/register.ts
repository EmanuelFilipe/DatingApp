import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCreds } from '../../../types/register-creds';
import { User } from '../../../types/users';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  private accountService = inject(AccountService)

  public membersFromHome = input.required<User[]>();
  public cancelRegister = output<boolean>()
  protected creds = {} as RegisterCreds
  
  ngOnInit(): void {
    //console.log('register.ts::membersFromApp', this.membersFromHome())
  }

  register() {
   this.accountService.register(this.creds).subscribe({
    next: response => {
      console.log(response)
      this.cancel()
    },
    error: error => console.warn(error)
   })
  }

  cancel() {
    this.cancelRegister.emit(false)
  }
}
