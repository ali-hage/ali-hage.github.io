import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectionStrategy, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';
import { SkillCategory } from '../../core/models';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsComponent implements OnInit, AfterViewInit, OnDestroy {
  private portfolioService = inject(PortfolioDataService);
  skills: SkillCategory[] = [];

  @ViewChild('fieldRef', { static: false }) fieldRef?: ElementRef<HTMLElement>;
  @ViewChild('shipRef', { static: false }) shipRef?: ElementRef<HTMLImageElement>;

  private rafId = 0;
  private running = false;

  private ship = { x: 0, y: 0, tx: 0, ty: 0, vx: 0, vy: 0, a: 0, ta: 0 };
  private fieldRect?: DOMRect;

  private bodies: Array<{ el: HTMLElement; baseX: number; baseY: number; ox: number; oy: number; vx: number; vy: number; w: number; h: number; }> = [];
  private lastTime = 0;
  private t = 0; // time accumulator for subtle ship bobbing

  ngOnInit(): void {
    this.portfolioService.getSkills().subscribe(skills => {
      this.skills = skills;
      // Wait for view to render, then initialize physics
      queueMicrotask(() => this.initPhysics());
    });
  }

  getTotalSkillsCount(): number {
    return this.skills.reduce((total, category) => total + category.skills.length, 0);
  }

  ngAfterViewInit(): void {
    this.initPhysics();
  }

  ngOnDestroy(): void {
    this.stop();
    window.removeEventListener('resize', this.handleResize);
    const field = this.fieldRef?.nativeElement;
    if (field) field.removeEventListener('pointermove', this.handlePointerMove as any);
  }

  private initPhysics = () => {
    const field = this.fieldRef?.nativeElement;
    const shipEl = this.shipRef?.nativeElement;
    if (!field || !shipEl) return;

    // Cache field bounds
    this.fieldRect = field.getBoundingClientRect();

    // Hook listeners once
    field.addEventListener('pointermove', this.handlePointerMove, { passive: true });
    window.addEventListener('resize', this.handleResize);

    // Prepare bodies from chips
    const chips = Array.from(field.querySelectorAll<HTMLElement>('.skill-chip'));
    const rectField = this.fieldRect;
    this.bodies = chips.map(el => {
      const r = el.getBoundingClientRect();
      const cx = r.left - rectField.left + r.width / 2;
      const cy = r.top - rectField.top + r.height / 2;
      return { el, baseX: cx, baseY: cy, ox: 0, oy: 0, vx: 0, vy: 0, w: r.width, h: r.height };
    });

    // Start with ship centered
    this.ship.x = (this.fieldRect.width || 0) * 0.5;
    this.ship.y = (this.fieldRect.height || 0) * 0.3;
    this.ship.tx = this.ship.x;
    this.ship.ty = this.ship.y;
    this.positionShip();

    if (!this.running) this.start();
  };

  private handlePointerMove = (e: PointerEvent) => {
    if (!this.fieldRect) return;
    const x = e.clientX - this.fieldRect.left;
    const y = e.clientY - this.fieldRect.top;
    // Clamp inside field
    this.ship.tx = Math.max(0, Math.min(this.fieldRect.width, x));
    this.ship.ty = Math.max(0, Math.min(this.fieldRect.height, y));
  };

  private handleResize = () => {
    const field = this.fieldRef?.nativeElement;
    if (!field) return;
    this.fieldRect = field.getBoundingClientRect();
    // Recompute bases
    const rectField = this.fieldRect;
    this.bodies.forEach(b => {
      const r = b.el.getBoundingClientRect();
      b.baseX = r.left - rectField.left + r.width / 2;
      b.baseY = r.top - rectField.top + r.height / 2;
    });
  };

  private start() {
    this.running = true;
    this.lastTime = performance.now();
    const loop = (t: number) => {
      if (!this.running) return;
      const dt = Math.min(1 / 30, (t - this.lastTime) / 1000) || 0.016;
      this.lastTime = t;
      this.update(dt);
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  private stop() {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  private positionShip() {
    const shipEl = this.shipRef?.nativeElement;
    if (!shipEl) return;
    const deg = (this.ship.a * 180) / Math.PI;
    // Subtle vertical bobbing based on time
    const bob = Math.sin(this.t * 2.2) * 2; // +/- 2px
    shipEl.style.transform = `translate(-50%, -50%) translate(${this.ship.x}px, ${this.ship.y + bob}px) rotate(${deg.toFixed(2)}deg)`;
  }

  private update(dt: number) {
    // Smoothly chase the mouse target
    const follow = 0.22; // higher = more eager chasING
    this.ship.vx += (this.ship.tx - this.ship.x) * follow;
    this.ship.vy += (this.ship.ty - this.ship.y) * follow;
    this.ship.vx *= 0.75; // damping
    this.ship.vy *= 0.75;
    this.ship.x += this.ship.vx * dt * 60;
    this.ship.y += this.ship.vy * dt * 60;

    // Always face the mouse target (chasing)
    this.ship.ta = Math.atan2(this.ship.ty - this.ship.y, this.ship.tx - this.ship.x);
    // Shortest angular difference
    let da = this.ship.ta - this.ship.a;
    da = Math.atan2(Math.sin(da), Math.cos(da));
    this.ship.a += da * 0.25; // turn rate smoothing
    this.t += dt; // advance time for bobbing
    this.positionShip();

    // Water-like interaction
    const R = 120;           // influence radius
    const push = 0.9;        // push strength
    const damping = 0.92;    // velocity damping (drift to a stop)

    for (const b of this.bodies) {
      const px = b.baseX + b.ox;
      const py = b.baseY + b.oy;
      let dx = px - this.ship.x;
      let dy = py - this.ship.y;
      const dist = Math.hypot(dx, dy) + 0.0001;

      if (dist < R) {
        // Normalize direction to body from ship
        dx /= dist; dy /= dist;
        // Push stronger in front of the ship, weaker behind
        const hx = Math.cos(this.ship.a);
        const hy = Math.sin(this.ship.a);
        const front = Math.max(0, hx * dx + hy * dy); // 0..1
        const frontBias = Math.pow(front, 1.25); // sharpen cone
        const f = (1 - dist / R) * push * (0.25 + 0.75 * frontBias);
        b.vx += dx * f;
        b.vy += dy * f;
      }

      // Damping and integrate
      b.vx *= damping;
      b.vy *= damping;
      b.ox += b.vx * dt * 60;
      b.oy += b.vy * dt * 60;

      // Apply transform
      b.el.style.transform = `translate3d(${b.ox.toFixed(2)}px, ${b.oy.toFixed(2)}px, 0)`;
    }
  }
}
