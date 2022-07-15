import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Cliente } from '../models/cliente';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private url: string = environment.urlEndPoint+'clientes';

  private httpHeaders: HttpHeaders = new HttpHeaders({'Content-type': 'application/json'});

  constructor(private http: HttpClient, private router: Router) { }

  getClientes(): Observable<Cliente[]>{
    return this.http.get(this.url).pipe(
      map(response => response as Cliente[])
    )
  }

  create(cliente: Cliente): Observable<Cliente>{
    return this.http.post<Cliente>(this.url, cliente, {headers: this.httpHeaders}).pipe(
      map((cliente: any) => cliente.cliente as Cliente),
      catchError(e =>{

        if(e.status == 400){
          return throwError(() => e);
        }

        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.errors, 'error');
        return  throwError(() => e);
      })
    );
  }

  getCliente(id: number): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.url}/${id}`).pipe(
      catchError(e =>{
        this.router.navigate(['/clientes']);
        Swal.fire('Error al editar el cliente',
        e.error.mensaje,
        'error');
        return throwError(() => e);
      })
    );
  }

  update(cliente:Cliente): Observable<any>{
    return this.http.put<any>(`${this.url}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e =>{

        if(e.status == 400){
          return throwError(() => e);
        }

        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.errors, 'error');
        return  throwError(() => e);
      })
    );
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.url}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e =>{
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return  throwError(() => e);
      })
    );
  }
}
