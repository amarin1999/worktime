import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer animation-page">
      <a href="https://www.facebook.com/cdg.co.th/" rel="noopener noreferrer" target="_blank" aria-label="Facebook">
        <svg class="icon-footer" viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
          <path
            fill="currentColor"
            d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"
          />
        </svg>
      </a>
      <div class="copyright">Copyright &copy; CDG Group | All Right Reserved</div>
    </footer>
  `,
  styles: `
    .footer {
      margin-top: 40px;
      text-align: center;
      color: #333377;
      font-weight: bold;
    }
    .icon-footer {
      padding: 10px;
      color: #333377;
      transition: 0.3s;
    }
    .icon-footer:hover {
      opacity: 0.5;
    }
    .copyright {
      padding: 10px;
    }
  `,
})
export class Footer {}
