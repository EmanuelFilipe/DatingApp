import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Message } from '../../types/message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private http = inject(HttpClient)
  private baseUrl = environment.apiUrl

  getMessages(container: string, pageNumber: number, pageSize: number) {
    let params = new HttpParams()
      .set('container', container)
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize)

    return this.http.get(`${this.baseUrl}/messages`, { params })
  }

  getMessageThread(memberId: string) {
    return this.http.get<Message[]>(`${this.baseUrl}/messages/thread/${memberId}`)
  }

  sendMessage(recipientId: string, content: string) {
    return this.http.post<Message>(this.baseUrl + '/messages', {recipientId, content})
  }

  deleteMessage(id: string) {
    return this.http.delete(`${this.baseUrl}/messages/${id}`)
  }
}
