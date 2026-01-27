import { Component, Input, OnInit, signal } from '@angular/core';
import { Register } from '../account/register/register';
import { User } from '../../types/users';

@Component({
  selector: 'app-home',
  imports: [Register],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  ngOnInit(): void {
    //console.log('home.ts::membersFromApp', this.membersFromApp)
  }

  @Input({required: true}) membersFromApp: User[] = []
  protected registerMode = signal(false)

  showRegister(value: boolean): void {
    this.registerMode.set(value)
  }
}
