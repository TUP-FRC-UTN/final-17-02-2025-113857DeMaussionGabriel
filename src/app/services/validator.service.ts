import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }
  
  
  getErrorMessage(control: AbstractControl): string {
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return '';
    }
  
    let errorKey = Object.keys(control.errors)[0];
  
    const errorMessages: { [key: string]: string } = {
      required: 'Este campo no puede estar vacio.',
      email: 'Formato de correo electronico invalido.',
      minlength: `El valor ingresado es demasiado corto. Minimo ${control.errors['minlength']?.requiredLength} caracteres.` ,
      apiFailed: 'Error en la API.',
      invalidDomain: 'El dominio del correo electronico debe ser @tecnicatura.frc.utn.edu.ar.',
    };
  
    return errorMessages[errorKey] || 'Error desconocido.';
  }
  
  getClassError(control: AbstractControl): string {
    let style: string = '';
    if (control.touched || control.dirty) {
      style = this.getErrorMessage(control) !== '' ? 'is-invalid' : 'is-valid';
    }
    
    return style;
  }
}
