import { Component, inject, Input, signal } from '@angular/core';
import { User } from '../../types/users';
import { RegisterSteps } from "../account/register-steps/register-steps";
import { AccountService } from '../../core/services/account-service';

@Component({
  selector: 'app-home',
  imports: [RegisterSteps],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  @Input({required: true}) membersFromApp: User[] = []
  protected registerMode = signal(false)
  protected accountService = inject(AccountService)

  showRegister(value: boolean): void {
    this.registerMode.set(value)
  }
}
