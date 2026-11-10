import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  textConfirm: string;
}

/** Yes/no dialog; closes with `true` when confirmed. */
@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <mat-dialog-content>
      <div class="question">
        <mat-icon>not_listed_location</mat-icon>
        {{ data.textConfirm }}
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="warn" [mat-dialog-close]="false"><mat-icon>clear</mat-icon> ยกเลิก</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="true"><mat-icon>check</mat-icon> ตกลง</button>
    </mat-dialog-actions>
  `,
  styles: `
    .question {
      font-size: 1.2em;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 0 16px;
    }
  `,
})
export class ConfirmDialog {
  protected readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}
