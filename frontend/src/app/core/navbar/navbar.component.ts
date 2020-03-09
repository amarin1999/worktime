import { Component, OnInit } from '@angular/core';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faHistory, faClock, faUserClock, faBook, faBookmark, faCalendar, faCalendarPlus } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  showToggle: boolean = false;
  navItem = [
    { icon: faCalendarPlus, name: 'ลงเวลาทำไซด์งาน' },
    { icon: faUserClock, name: 'การทำงานล่วงเวลา' },
    { icon: faHistory, name: 'ประวัติการลงเวลา' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
