import { Component, inject, input, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RegisterCreds } from '../../../types/register-creds';
import { User } from '../../../types/users';
import { AccountService } from '../../../core/services/account-service';
import { ToastService } from '../../../core/services/toast-service';
import { ValidateRequiredFields } from '../../../app/utils/validators/register.validators';
import { JsonPipe } from '@angular/common';
import { TextInput } from '../../../shared/text-input/text-input';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, JsonPipe, FormsModule, TextInput],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private accountService = inject(AccountService)
  private toastService = inject(ToastService)
  private fb = inject(FormBuilder)

  public membersFromHome = input.required<User[]>();
  public cancelRegister = output<boolean>()
  protected creds = {} as RegisterCreds
  protected registerForm: FormGroup

  constructor() {
    // this.registerForm = new FormGroup({
    //   email: new FormControl('', [Validators.required, Validators.email]),
    //   displayName: new FormControl('', Validators.required),
    //   password: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(8)]),
    //   confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')]),
    // })

    // this.registerForm.controls['password'].valueChanges.subscribe(() => {
    //   this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    // })

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
    })

    this.registerForm.controls['password'].valueChanges.subscribe(() => {
      this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent
      if (!parent) return null

      const matchValue = parent.get(matchTo)?.value

      return control.value === matchValue ? null : { passwordMismatch: true }
    }
  }

  register() {
    console.log(this.registerForm.value as RegisterCreds)
    // const resultRequiredFields = ValidateRequiredFields(this.creds)
    // if (resultRequiredFields) {
    //   this.toastService.error(resultRequiredFields)
    //   return
    // }

    // this.accountService.register(this.creds).subscribe({
    //   next: response => {
    //     console.log(response)
    //     this.cancel()
    //   },
    //   error: (error) => {
    //     if (error?.length > 0) {
    //       let message = '';
    //       error.forEach((element: string) => {
    //         message += element + ' <br>'
    //       });
    //       this.toastService.error(message)
    //     }
    //   }
    // })
  }

  cancel() {
    this.cancelRegister.emit(false)
  }
}
