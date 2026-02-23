import { JsonPipe } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TextInput } from '../../../shared/text-input/text-input';
import { ToastService } from '../../../core/services/toast-service';
import { User } from '../../../types/users';
import { RegisterCreds } from '../../../types/register-creds';
import { Router } from '@angular/router';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-register-steps',
  imports: [ReactiveFormsModule, FormsModule, TextInput],
  templateUrl: './register-steps.html',
  styleUrl: './register-steps.css',
})
export class RegisterSteps {
  private accountService = inject(AccountService)
  private router = inject(Router)
  private toastService = inject(ToastService)
  private fb = inject(FormBuilder)

  public membersFromHome = input.required<User[]>();
  public cancelRegister = output<boolean>()
  protected creds = {} as RegisterCreds
  protected credentialsForm: FormGroup
  protected profileForm: FormGroup
  protected currentStep = signal(1)
  protected validationErrors = signal<string[]>([])

  constructor() {
    this.credentialsForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
    })

    this.profileForm = this.fb.group({
      gender: ['male', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required]
    })

    this.credentialsForm.controls['password'].valueChanges.subscribe(() => {
      this.credentialsForm.controls['confirmPassword'].updateValueAndValidity()
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

  nextStep() {
    if (this.credentialsForm.valid) {
      this.currentStep.update(prevStep => prevStep + 1)
    }
  }

  prevStep() {
    this.currentStep.update(prevStep => prevStep - 1)
  }

  getMaxDate() {
    const today = new Date()
    today.setFullYear(today.getFullYear() - 18)
    return today.toISOString().split('T')[0]
  }

  register() {
    if (this.credentialsForm.valid && this.profileForm.valid) {
      const formData = { ...this.credentialsForm.value, ...this.profileForm.value }
      
      this.accountService.register(formData).subscribe({
        next: () => {
          console.log('Registration successful!')
          this.toastService.success('Registration successful!')
          this.router.navigateByUrl('/members')
        },
        error: (error) => {
          if (error?.length > 0) {

            let message = '';
            error.forEach((element: string) => {
              message += element + ' <br>'
            });
            this.validationErrors.set(error)
            this.toastService.error(message)
          }
        }
      })

    }
    // const resultRequiredFields = ValidateRequiredFields(this.creds)
    // if (resultRequiredFields) {
    //   this.toastService.error(resultRequiredFields)
    //   return
    // }

   
  }

  cancel() {
    this.cancelRegister.emit(false)
  }
}
