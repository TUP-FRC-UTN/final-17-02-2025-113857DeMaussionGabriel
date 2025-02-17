import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ValidatorService } from '../../services/validator.service';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private validatorService: ValidatorService, private apiService: ApiService) {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.minLength(3), this.emailDomainValidator]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  ngOnInit(): void {
      localStorage.clear();
  }
  

  showErrors(controlName: string): string {
    let errorMessage: string = this.validatorService.getErrorMessage(this.loginForm.get(controlName)!)
    return errorMessage;
  }

  isValid(controlName: string): string {
    let errorClass: string = this.validatorService.getClassError(this.loginForm.get(controlName)!)
    return errorClass;
  }

  onSubmit() {
    console.log(this.loginForm.value);

    this.apiService.login(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value).subscribe({
      next: (response) => {
        console.log(response);

        if (response.length > 0) {
          localStorage.setItem('user', JSON.stringify(response[0]));
          window.location.href = `/scores?name=${encodeURIComponent(response[0].name)}`;
        }
        else {
          alert('Usuario o contraseña incorrectos');
        }
      },
      error: (error) => {
        console.log('Error en la API');
        console.error(error);
        if (error.status === 404) {
          alert('Usuario o contraseña incorrectos');
        }
      }
    });
  }

  emailDomainValidator(control: FormControl): ValidationErrors | null {
    const email: string = control.value;
    if (email.includes('@')) {
      const [_, domain] = email.split('@');
      if (domain !== 'tecnicatura.frc.utn.edu.ar') {
        return { invalidDomain: true };
      }
    }

    return null;
  }
}
