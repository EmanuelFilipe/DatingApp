//import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
//import { lastValueFrom } from 'rxjs';
import { Nav } from "../layout/nav/nav";
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [Nav, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App  {
  protected router = inject(Router)
  // private http = inject(HttpClient)

  // protected readonly title = 'Dating App'
  // protected members = signal<User[]>([])

  // async ngOnInit() {
  //   this.members.set(await this.getMembers())
  // }

  // async getMembers() {
  //   try {
  //     // novo jeito de retornar uma promise
  //     return lastValueFrom(this.http.get<User[]>('https://localhost:5001/api/members'))
  //   } catch (error) {
  //     console.error(error)
  //     throw error
  //   }
  // }
}
