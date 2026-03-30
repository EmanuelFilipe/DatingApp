import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-test-errors',
  imports: [],
  templateUrl: './test-errors.html',
  styleUrl: './test-errors.css',
})
export class TestErrors {
  private http = inject(HttpClient)
  baseUrl = environment.apiUrl //'https://localhost:5001/api/'
  validationErrors = signal<string[]>([])

  get400ValidationError() {
    this.http.post(this.baseUrl + '/account/register', {}).subscribe({
      next: response => console.log(response),
      error: error => { 
        console.log('400ValidationError', error)
        this.validationErrors.set(error)
      }
    })
  }

  get401Error() {
    this.http.get(this.baseUrl + '/buggy/auth').subscribe({
      next: response => console.log(response),
      error: error => console.log('error', error)
    })
  }

  get404Error() {
    this.http.get(this.baseUrl + '/buggy/not-found').subscribe({
      next: response => console.log(response),
      error: error => console.log('error', error)
    })
  }

  get400Error() {
    this.http.get(this.baseUrl + '/buggy/bad-request').subscribe({
      next: response => console.log(response),
      error: error => console.log('error', error)
    })
  }

  get500Error() {
    this.http.get(this.baseUrl + '/buggy/server-error').subscribe({
      next: response => console.log(response),
      error: error => console.log('error', error)
    })
  }

  
}
