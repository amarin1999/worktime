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
import { Router } from '@angular/router';
import { SideWorkService } from 'src/app/shared/service/sidework.service';
import * as moment from 'moment';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';

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
  formGroupSideWork2: FormGroup;
  workAnywhereCheck = false;
  testCheck = false;

  constructor(
    private buildForm: FormBuilder,
    private dialogConfirm: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.createFormSideWork();
     this.workAnyWhere2();
    this.WorkAnyWhereChange();
  }

  // สร้าง form
  createFormSideWork(): void {
    this.formGroupSideWork2 = this.buildForm.group(
      {
        date: [
          { value: this.transformDate(this.dataForm.date), disabled: true },
          [Validators.required],
        ],
        startTime: [this.dataForm.startTime, [Validators.required]],
        endTime: [this.dataForm.endTime, [Validators.required]],
        workAnyWhere: [this.dataForm.workAnyWhere],
        checkWorkAnyWhere: [false],
        workAnyWhere2: [false],
        remark: [this.dataForm.remark, [Validators.maxLength(250)]],
      },
      {
        validators: [this.compareTime],
      }
    );
  }

  workAnyWhere2() {
    const workAnyWhereValue = this.formGroupSideWork2.get('workAnyWhere').value;

    if (workAnyWhereValue == 0) {
      this.testCheck = true;
      this.workAnywhereCheck = false;
       this.formGroupSideWork2.get('workAnyWhere2').setValue(false);
       this.formGroupSideWork2.get('checkWorkAnyWhere').setValue(true);
    }
    if (workAnyWhereValue == 1 || workAnyWhereValue == 2 || workAnyWhereValue == 3) {
      this.workAnywhereCheck = true;
       this.formGroupSideWork2.get('workAnyWhere2').setValue(true);
        this.formGroupSideWork2.get('checkWorkAnyWhere').setValue(false);
      console.log(this.formGroupSideWork2.get('workAnyWhere2').value)
    }

    this.formGroupSideWork2.get('workAnyWhere2').updateValueAndValidity;
  }

  WorkAnyWhereChange() {
    const remarkControl = this.formGroupSideWork2.get('remark');
    const remarkValue = this.formGroupSideWork2.get('remark').value;

    this.formGroupSideWork2.get('workAnyWhere').valueChanges.subscribe(workAnyWhere => {
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

  remarkChange() {
    const remarkControl = this.formGroupSideWork2.get('remark');
    const remarkValue = this.formGroupSideWork2.get('remark').value;
    let realRemark :string;
    if(remarkValue != null){
       realRemark = remarkValue.replace(/\s/g, "")
    }

    const workAnyWhereValue = this.formGroupSideWork2.get('workAnyWhere').value;

    if (workAnyWhereValue == 1) {
      remarkControl.setValidators([Validators.maxLength(250)]);
    }
    if ((realRemark == null || realRemark == '') && (workAnyWhereValue == 2 || workAnyWhereValue == 3)) {
      this.formGroupSideWork2.get('remark').reset(null);
      remarkControl.setValidators([Validators.maxLength(250), Validators.required]);
    }
    remarkControl.updateValueAndValidity();
  }

  forgotCardCheck() {
    this.workAnywhereCheck = false;
    this.formGroupSideWork2.get('workAnyWhere2').setValue(false);
  }

  workAnyWhereCheck() {
 
      this.workAnywhereCheck = true;
      this.formGroupSideWork2.get('checkWorkAnyWhere').setValue(false);
    
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
    if(this.formGroupSideWork2.get('checkWorkAnyWhere').value == true){
      this.formGroupSideWork2.get('workAnyWhere').setValue(0);
    }
    // ถ้า validate ผ่าน
    if (this.formGroupSideWork2.valid) {
      this.editEmit.emit(this.formGroupSideWork2.getRawValue());
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
