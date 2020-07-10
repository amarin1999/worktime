import { Component, EventEmitter, Input, OnInit, Output, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { first } from 'rxjs/operators';
import { LayoutConstants } from 'src/app/shared/constants/LayoutConstants';
import { OvertimeWork } from 'src/app/shared/interfaces/overtime';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-edit-overtime-work-form',
  templateUrl: './edit-overtime-work-form.component.html',
  styleUrls: ['./edit-overtime-work-form.component.scss']
})
export class EditOvertimeWorkFormComponent implements OnInit {
  @Input() dataForm: OvertimeWork;
  @Output() editEmit: EventEmitter<OvertimeWork> = new EventEmitter();
  @Output() deleteEmit: EventEmitter<OvertimeWork> = new EventEmitter();
  // constants
  formGrid: string = LayoutConstants.gridFormPrimeNg;
  // date
  maxDate: Date = new Date();
  // form
  formGroupOvertimeWork: FormGroup;

  constructor(
    private buildForm: FormBuilder,
    private dialogConfirm: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.buildFormOvertime();
  }

  // สร้างฟอร์ม
  buildFormOvertime(): void {
    // set date format to form
    const startTime = moment(
      this.dataForm.startTime,
      'DD/MM/YYYY HH:mm:ss'
    ).format('YYYY/MM/DD HH:mm:ss');
    const endTime = moment(this.dataForm.endTime, 'DD/MM/YYYY HH:mm:ss').format(
      'YYYY/MM/DD HH:mm:ss'
    );

    this.formGroupOvertimeWork = this.buildForm.group(
      {
        startTime: [new Date(startTime), [Validators.required]],
        endTime: [new Date(endTime), [Validators.required]],
        projectNo: [
          this.dataForm.idProject,
          [Validators.required, Validators.maxLength(45)]
        ],
        remark: [this.dataForm.remark, [Validators.maxLength(250)]]
      },
      {
        validators: [this.compareTime]
      }
    );
  }

  // validate เวลา
  compareTime(group: FormGroup): void {
    const startTime = group.get('startTime').value;
    const endTime = group.get('endTime').value;
    if (startTime > endTime && endTime !== null) {
      group.get('endTime').setValue(undefined);
      group.get('endTime').setErrors({ wrongDate: true });
    } else {
      return null;
    }
  }

  // submit
  onSubmit(): void {
    if (this.formGroupOvertimeWork.valid) {
      this.editEmit.emit(this.formGroupOvertimeWork.getRawValue());
    }
  }

  deleteOvertime(): void {
    this.openDialogConfirm();
  }

  // show confirm return true | false
  openDialogConfirm(): void {
    const configDialog: MatDialogConfig<any> = {
      disableClose: true,
      autoFocus: false,
      width: '370px',
      height: '170px',
      data: {
        textConfirm: 'ยืนยันการลบรายการ ?'
      }
    };
    // เปิด dialog
    const dialogRef = this.dialogConfirm.open(
      ConfirmDialogComponent,
      configDialog
    );
    // หลังปิด dialog
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(confirmStatus => {
        if (confirmStatus) {
          this.deleteEmit.emit(this.data.id);
        }
      });
  }
}
