import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCreds } from '../../../types/register-creds';
import { User } from '../../../types/users';
import { AccountService } from '../../../core/services/account-service';
import { ToastService } from '../../../core/services/toast-service';
import { ValidateRequiredFields } from '../../../app/utils/validators/register.validators';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  private accountService = inject(AccountService)
  private toastService = inject(ToastService)

  public membersFromHome = input.required<User[]>();
  public cancelRegister = output<boolean>()
  protected creds = {} as RegisterCreds
  
  ngOnInit(): void {
    //console.log('register.ts::membersFromApp', this.membersFromHome())
  }

  register() {
    const resultRequiredFields = ValidateRequiredFields(this.creds)
    if (resultRequiredFields) {
      this.toastService.error(resultRequiredFields)
      return
    }

   this.accountService.register(this.creds).subscribe({
    next: response => {
      console.log(response)
      this.cancel()
    },
    error: (error) => {
      if (error?.length > 0) {
        let message = '';
        error.forEach((element: string) => {
          message += element + ' <br>'
        });
        this.toastService.error(message)
      }
    }
   })
  }

  cancel() {
    this.cancelRegister.emit(false)
  }
}
