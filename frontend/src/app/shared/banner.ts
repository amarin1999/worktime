import { Component, input } from '@angular/core';

@Component({
  selector: 'app-banner',
  template: `
    <div class="banner animation-page">
      <img src="assets/images/banner.png" alt="CDG" />
      <h1 class="header-text">{{ text() }}</h1>
    </div>
  `,
  styles: `
    .banner {
      text-align: center;
      padding: 8px;
    }
    img {
      height: 10vh;
      width: auto;
      margin-bottom: 16px;
    }
  `,
})
export class Banner {
  readonly text = input.required<string>();
}
