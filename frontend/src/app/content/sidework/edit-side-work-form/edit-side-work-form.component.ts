import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { first, finalize } from 'rxjs/operators';
import { LayoutConstants } from 'src/app/shared/constants/LayoutConstants';
import { SideWork } from 'src/app/shared/interfaces/sidework';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-side-work-form',
  templateUrl: './edit-side-work-form.component.html',
  styleUrls: ['./edit-side-work-form.component.scss'],
})
export class EditSideWorkFormComponent implements OnInit {
  @Input() dataForm: SideWork;
  @Output() editEmit: EventEmitter<SideWork> = new EventEmitter();
  @Output() deleteEmit: EventEmitter<SideWork> = new EventEmitter();

  // constants
  formGrid: string = LayoutConstants.gridFormPrimeNg;
  // form
  formGroupSideWorkEdit: FormGroup;
  workAnyWhereType = false;

  ForgotCardChecked: boolean = false;
  workAnyWhereChecked: boolean = false;
  
  constructor(
    private buildForm: FormBuilder,
    private dialogConfirm: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.createFormSideWork();
    this.workAnyWhereSet();
    this.WorkAnyWhereChange();
  }

  // สร้าง form
  createFormSideWork(): void {
    this.formGroupSideWorkEdit = this.buildForm.group(
      {
        date: [
          { value: this.transformDate(this.dataForm.date), disabled: true },
          [Validators.required],
        ],
        startTime: [this.dataForm.startTime, [Validators.required]],
        endTime: [this.dataForm.endTime, [Validators.required]],
        workAnyWhere: [this.dataForm.workAnyWhere],
        ForgotCardCheck: [false],
        workAnyWhereCheck: [false],
        remark: [this.dataForm.remark, [Validators.maxLength(250)]],
      },
      {
        validators: [this.compareTime],
      }
    );
  }

  workAnyWhereSet() {
    const workAnyWhereValue = this.formGroupSideWorkEdit.get('workAnyWhere').value;

    // ลืมบัตรพนักงาน
    if (workAnyWhereValue == 0) {
      this.workAnyWhereType = false;
      this.workAnyWhereChecked = false;
      this.ForgotCardChecked = true;
      this.formGroupSideWorkEdit.get('workAnyWhereCheck').setValue(false);
      this.formGroupSideWorkEdit.get('ForgotCardCheck').setValue(true);
    }

    // Work AnyWhere
    if (workAnyWhereValue == 1 || workAnyWhereValue == 2 || workAnyWhereValue == 3) {
      this.workAnyWhereType = true;
      this.workAnyWhereChecked = true;
      this.ForgotCardChecked = false;
      this.formGroupSideWorkEdit.get('workAnyWhereCheck').setValue(true);
      this.formGroupSideWorkEdit.get('ForgotCardCheck').setValue(false);
    }

    this.formGroupSideWorkEdit.get('workAnyWhereCheck').updateValueAndValidity;
  }

  // กรณี Work Anywhere ถูกคลิ๊ก และ radio ตัวเลือกถูกเปลี่ยน
  WorkAnyWhereChange() {
    const remarkControl = this.formGroupSideWorkEdit.get('remark');
    const remarkValue = this.formGroupSideWorkEdit.get('remark').value;

    this.formGroupSideWorkEdit.get('workAnyWhere').valueChanges.subscribe(workAnyWhere => {
      if (workAnyWhere == 1) {
        remarkControl.setValidators([Validators.maxLength(250)]);
      }
      if (workAnyWhere == 2 && (remarkValue == '' || remarkValue == null)) {
        remarkControl.setValidators([Validators.maxLength(250), Validators.required]);
      }
      if (workAnyWhere == 3 && (remarkValue == '' || remarkValue == null)) {
        remarkControl.setValidators([Validators.maxLength(250), Validators.required]);
      }
      remarkControl.updateValueAndValidity();
    })
  }

  // ตรวจสอบ valid กรณีหมายเหตุถูกแก้ไข
  remarkChange() {
    const remarkControl = this.formGroupSideWorkEdit.get('remark');
    const remarkValue = this.formGroupSideWorkEdit.get('remark').value;
    let realRemark: string;
    if (remarkValue != null) {
      realRemark = remarkValue.replace(/\s/g, "")
    }

    const workAnyWhereValue = this.formGroupSideWorkEdit.get('workAnyWhere').value;

    if (workAnyWhereValue == 1) {
      remarkControl.setValidators([Validators.maxLength(250)]);
    }
    if ((realRemark == null || realRemark == '') && (workAnyWhereValue == 2 || workAnyWhereValue == 3)) {
      this.formGroupSideWorkEdit.get('remark').reset(null);
      remarkControl.setValidators([Validators.maxLength(250), Validators.required]);
    }
    remarkControl.updateValueAndValidity();
  }

  // ลืมบัตรพนักงานถูกติ้ก
  forgotCardClick() {
    if (this.formGroupSideWorkEdit.get('ForgotCardCheck').value == true) {
      this.formGroupSideWorkEdit.get('workAnyWhereCheck').setValue(true);
      this.formGroupSideWorkEdit.get('workAnyWhere').setValue(1);
      this.workAnyWhereType = false;
      this.workAnyWhereChecked = false;
    } else {
      this.workAnyWhereType = true;
      this.formGroupSideWorkEdit.get('workAnyWhereCheck').setValue(false);
      this.workAnyWhereChecked = true;

      const remarkControl = this.formGroupSideWorkEdit.get('remark');
      remarkControl.setValidators([Validators.maxLength(250)]);
      remarkControl.updateValueAndValidity();

    }

  }

   // Work Anywhere ถูกติ้ก
  workAnyWhereClick() {
    if (this.formGroupSideWorkEdit.get('workAnyWhereCheck').value == true) {
      this.workAnyWhereType = true;
      this.formGroupSideWorkEdit.get('workAnyWhere').setValue(1);
      this.formGroupSideWorkEdit.get('ForgotCardCheck').setValue(false);
      this.ForgotCardChecked = false;
    } else {
      this.workAnyWhereType = false;
      this.formGroupSideWorkEdit.get('workAnyWhere').setValue(0);
      this.formGroupSideWorkEdit.get('ForgotCardCheck').setValue(["true"]);
      this.ForgotCardChecked = true;
    }

  }

  transformDate(date: Date): string { // แปลงเป็น พศ.แล้วเอาเข้า formGroup
    const dateFormat = moment(date, 'DD/MM/YYYY').add(543, 'year').format('DD/MM/YYYY');
    return dateFormat;
  }

  // validate เวลา
  compareTime(group: FormGroup): void {
    const startTime = group.get('startTime').value;
    const endTime = group.get('endTime').value;
    if (startTime >= endTime && endTime !== null && endTime !== '00:00') {
      group.get('endTime').setValue(undefined);
      group.get('endTime').setErrors({ wrongDate: true });
    } else if (startTime >= endTime && endTime === '00:00') {
      return null;
    } else {
      return null;
    }
  }

  // กดปุ่ม
  onSubmit(): void {
    if (this.formGroupSideWorkEdit.get('ForgotCardCheck').value == true) {
      this.formGroupSideWorkEdit.get('workAnyWhere').setValue(0);
    }
    if(this.formGroupSideWorkEdit.get('remark').value == ''){
      this.formGroupSideWorkEdit.get('remark').setValue(null);
    }
    // ถ้า validate ผ่าน
    if (this.formGroupSideWorkEdit.valid) {
      this.editEmit.emit(this.formGroupSideWorkEdit.getRawValue());
    }
  }

  deleteSidework(): void {
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
        textConfirm: 'ยืนยันการลบรายการ ?',
      },
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
      .subscribe((confirmStatus: boolean) => {
        if (confirmStatus) {
          this.deleteEmit.emit(this.data.id);
        }
      });
  }
}