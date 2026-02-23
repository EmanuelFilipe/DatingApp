import { Component, Input, signal } from '@angular/core';
import { User } from '../../types/users';
import { RegisterSteps } from "../account/register-steps/register-steps";

@Component({
  selector: 'app-home',
  imports: [RegisterSteps],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  @Input({required: true}) membersFromApp: User[] = []
  protected registerMode = signal(false)

  showRegister(value: boolean): void {
    this.registerMode.set(value)
  }
}
