import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/eniroment';

@Injectable({
  providedIn: 'root'
})


export class FormDataService {

  private apiKey = 'gRnMxbEdZjkVr9m9jc18o4DcLu9CbD202KmzVp0m0LN-YPlZXUvXKgmp2GrJd9o6F1NfUFUKIyyGzh9LJ56G1LFZsJClNkbJjf-iCHhvLj1kO8oDaLKaS2pvtu1IcgsgFgqDuT4B0TieOpn8GEJuiUIM-VXUMvCR0JdsH9vWDr2KjewWqfCsQbnudLP2sUwz0vAWpLNaDPpFbXeq3V-xO7W1qlO9ETHtnoBBUHyrQQPIIiE4Ywc4oDsFkANjSxT9';

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-API-KEY': this.apiKey
    });
  }


  getFormData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Postulantes/formdata`, { headers: this.getHeaders() });
  }

}
