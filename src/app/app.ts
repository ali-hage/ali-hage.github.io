import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DOCUMENT, DatePipe } from '@angular/common';
import { Renderer2 } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DatePipe, HeaderComponent, FooterComponent],
  template: `
    <div class="tty">
      <div class="panel">
        <app-header></app-header>
        <div style="display:flex;align-items:center;gap:12px;margin:10px 0;">
          <span class="buoy buoy--port">PORT</span>
          <span class="muted" style="margin-left:auto;">SHIP CONSOLE • UTC {{ now | date:'HH:mm:ss':'UTC' }}</span>
          <span class="buoy buoy--starboard">STBD</span>
        </div>
        <router-outlet />
        <app-footer></app-footer>
      </div>
      
    </div>
  `,
  styles: []
})
export class App implements OnInit, OnDestroy {
  title = 'Ali Hage Hassan - Maritime Engineering Portfolio';
  now = new Date();
  private sub?: Subscription;

  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private doc: Document) {}

  ngOnInit(): void {
    this.renderer.addClass(this.doc.body, 'terminal');
    this.sub = interval(1000).subscribe(() => (this.now = new Date()));
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
    this.renderer.removeClass(this.doc.body, 'terminal');
  }
}
