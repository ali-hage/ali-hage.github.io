import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectionStrategy, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';
import { CertificationCategory } from '../../core/models';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certifications.component.html',
  styleUrls: ['./certifications.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CertificationsComponent implements OnInit, AfterViewInit, OnDestroy {
  private portfolioService = inject(PortfolioDataService);
  
  certifications: CertificationCategory[] = [];

  @ViewChild('matrixCanvas', { static: false }) matrixCanvas?: ElementRef<HTMLCanvasElement>;

  // Matrix effect properties
  private matrixCtx?: CanvasRenderingContext2D | null;
  private matrixColumns: number[] = [];
  private matrixChars = '01$#@%&*+-=<>[]{}()|\\/_~`^abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private fontSize = 10;
  private matrixSpeed = 50;
  private rafId = 0;
  private running = false;
  private lastTime = 0;
  private t = 0;

  ngOnInit(): void {
    this.portfolioService.getCertifications().subscribe(certs => {
      this.certifications = certs;
    });
  }

  ngAfterViewInit(): void {
    // Delay initialization to ensure DOM is fully rendered
    setTimeout(() => {
      this.initMatrix();
      this.start();
    }, 100);
  }

  ngOnDestroy(): void {
    this.stop();
  }

  private initMatrix() {
    const canvas = this.matrixCanvas?.nativeElement;
    if (!canvas) return;

    this.matrixCtx = canvas.getContext('2d');
    if (!this.matrixCtx) return;

    // Set canvas size based on container
    const container = canvas.parentElement;
    canvas.width = 300;
    canvas.height = container ? container.offsetHeight : 600;
    
    // Initialize matrix columns
    const columns = Math.floor(canvas.width / this.fontSize);
    this.matrixColumns = Array(columns).fill(0);
    
    // No initial background - keep transparent
  }

  private drawMatrix() {
    if (!this.matrixCtx || !this.matrixCanvas?.nativeElement) return;

    const canvas = this.matrixCanvas.nativeElement;
    
    // Create fade effect with transparent background
    this.matrixCtx.globalCompositeOperation = 'destination-out';
    this.matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.matrixCtx.fillRect(0, 0, canvas.width, canvas.height);
    this.matrixCtx.globalCompositeOperation = 'source-over';
    
    // Set text properties with terminal cyan color
    this.matrixCtx.fillStyle = 'rgba(126, 236, 255, 0.8)';
    this.matrixCtx.font = `${this.fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace`;
    
    // Draw characters
    for (let i = 0; i < this.matrixColumns.length; i++) {
      const char = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
      const x = i * this.fontSize;
      const y = this.matrixColumns[i] * this.fontSize;
      
      // Add some variation to the brightness
      const alpha = 0.3 + Math.random() * 0.5;
      this.matrixCtx.fillStyle = `rgba(126, 236, 255, ${alpha})`;
      this.matrixCtx.fillText(char, x, y);
      
      // Reset column if it goes off screen
      if (y > canvas.height && Math.random() > 0.975) {
        this.matrixColumns[i] = 0;
      } else {
        this.matrixColumns[i]++;
      }
    }
  }

  private start() {
    this.running = true;
    this.lastTime = performance.now();
    const loop = (t: number) => {
      if (!this.running) return;
      const dt = Math.min(1 / 30, (t - this.lastTime) / 1000) || 0.016;
      this.lastTime = t;
      this.t += dt;
      
      // Draw matrix effect at slower rate
      if (Math.floor(this.t * this.matrixSpeed) % 3 === 0) {
        this.drawMatrix();
      }
      
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  private stop() {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}