import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="wrap animation-page">
      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar class="avatar">sentiment_dissatisfied</mat-icon>
          <mat-card-title>ไม่พบหน้าเพจ</mat-card-title>
          <mat-card-subtitle>404 Not Found</mat-card-subtitle>
        </mat-card-header>
        <mat-card-actions>
          <a mat-button routerLink="/main"><mat-icon>home</mat-icon> กลับหน้าหลัก</a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: `
    .wrap {
      width: 66%;
      margin: 0 auto 80px;
    }
    .avatar {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: #333377;
    }
    @media screen and (max-width: 640px) {
      .wrap {
        width: 90%;
      }
    }
  `,
})
export class NotFound {}
