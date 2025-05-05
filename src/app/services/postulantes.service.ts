import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class PostulantesService {

  private baseUrl = environment.apiUrl;


  private apiKey = 'gRnMxbEdZjkVr9m9jc18o4DcLu9CbD202KmzVp0m0LN-YPlZXUvXKgmp2GrJd9o6F1NfUFUKIyyGzh9LJ56G1LFZsJClNkbJjf-iCHhvLj1kO8oDaLKaS2pvtu1IcgsgFgqDuT4B0TieOpn8GEJuiUIM-VXUMvCR0JdsH9vWDr2KjewWqfCsQbnudLP2sUwz0vAWpLNaDPpFbXeq3V-xO7W1qlO9ETHtnoBBUHyrQQPIIiE4Ywc4oDsFkANjSxT9';


  constructor(private http: HttpClient) { }

  private getHeaders(isFormData: boolean = false): HttpHeaders {
    let headers = new HttpHeaders({
      'X-API-KEY': this.apiKey
    });

    if (!isFormData) {
      // Solo agregar el Content-Type si no es FormData
      headers = headers.set('Content-Type', 'application/json');
    }

    return headers;
  }

  enviarDatos(postulante: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Postulantes`, postulante, { headers: this.getHeaders() });
  }

  enviarImagen(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Documentos`, formData, { headers: this.getHeaders(true) });
  }

  recibirListado(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/postulantes`, { headers: this.getHeaders() });
  }

  verificarPostulante(dni: number, tipoInscripcionId: number, mail: string): Observable<any> {
    const body = { dni, tipoInscripcionId, mail };
    return this.http.post<any>(`${this.baseUrl}/Postulantes/verificar`, body, { headers: this.getHeaders() });
  }


}
