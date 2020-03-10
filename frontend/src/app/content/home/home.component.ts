import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  menu: { title: string, img: string, routerLink: string, detail: string }[] = [
    {
      title: 'ลงเวลาทำไซต์งาน',
      img: 'survey.svg',
      routerLink: '',
      detail: 'ลงเวลาทำไซด์งาน สำหรับพนักงานที่ได้รับหมายในการทำงานไซด์งาน'
    }, {
      title: 'การทำงานล่วงเวลา',
      img: 'overtime.svg',
      routerLink: '',
      detail:'ลงเวลาทำงาน สำหรับพนักงานที่ต้องการทำงานล่วงเวลา'
    }, {
      title: 'ประวัติการลงเวลา',
      img: 'history.svg',
      routerLink: '',
      detail:'ตรวจสอบประวติการลงเวลาของพนักงาน'
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
