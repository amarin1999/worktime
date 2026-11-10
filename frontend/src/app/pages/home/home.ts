import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Banner } from '../../shared/banner';

interface MenuItem {
  title: string;
  img: string;
  link: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, Banner],
  template: `
    <app-banner text="ลงเวลาการทำงานนอกสถานที่ และการทำงานล่วงเวลา" />
    <div class="menu">
      @for (item of menu; track item.link) {
        <a class="card" [routerLink]="item.link">
          <h1>{{ item.title }}</h1>
          <img [src]="item.img" alt="" />
        </a>
      }
    </div>
  `,
  styleUrl: './home.scss',
})
export class Home {
  protected readonly menu: MenuItem[] = [
    { title: 'ทำงานนอกสถานที่', img: 'assets/images/survey.svg', link: '/main/sidework-calendar' },
    { title: 'ทำงานล่วงเวลา', img: 'assets/images/overtime.svg', link: '/main/overtime-calendar' },
    { title: 'ประวัติการลงเวลา', img: 'assets/images/history.svg', link: '/main/history' },
  ];
}
