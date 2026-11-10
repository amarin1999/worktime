import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { Footer } from '../../layout/footer';

@Component({
  selector: 'app-signin',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    Footer,
  ],
  templateUrl: './signin.html',
  styleUrl: './signin.scss',
})
export class Signin {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly hidePassword = signal(true);
  protected readonly submitting = signal(false);

  protected readonly form = inject(NonNullableFormBuilder).group({
    employeeNo: ['', [Validators.required, Validators.maxLength(10)]],
    password: ['', [Validators.required, Validators.maxLength(100)]],
  });

  onSubmit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    const { employeeNo, password } = this.form.getRawValue();
    this.auth.login({ employeeNo: employeeNo.trim(), password }).subscribe({
      next: () => void this.router.navigate(['/main/sidework-calendar']),
      error: () => {
        // The error toast interceptor shows the problem `detail`.
        this.submitting.set(false);
        this.form.controls.password.reset();
      },
    });
  }
}
