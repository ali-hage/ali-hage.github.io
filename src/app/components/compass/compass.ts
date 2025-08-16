import { Component, OnInit, OnDestroy, ElementRef, ViewChild, HostListener } from '@angular/core';

@Component({
  selector: 'app-compass',
  standalone: true,
  imports: [],
  templateUrl: './compass.html',
  styleUrl: './compass.css'
})
export class CompassComponent implements OnInit, OnDestroy {
  @ViewChild('compassElement', { static: true }) compassElement!: ElementRef;
  
  needleAngle: number = 0;
  private compassRect: DOMRect | null = null;

  ngOnInit(): void {
    // Get compass position after view init
    setTimeout(() => {
      this.updateCompassRect();
    });
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.compassRect) {
      this.updateCompassRect();
      return;
    }

    // Calculate compass center
    const compassCenterX = this.compassRect.left + this.compassRect.width / 2;
    const compassCenterY = this.compassRect.top + this.compassRect.height / 2;

    // Calculate angle from compass center to mouse
    const deltaX = event.clientX - compassCenterX;
    const deltaY = event.clientY - compassCenterY;
    
    // Calculate angle in degrees (0° = North, clockwise)
    let angle = Math.atan2(deltaX, -deltaY) * (180 / Math.PI);
    
    // Normalize to 0-360 degrees
    if (angle < 0) {
      angle += 360;
    }
    
    this.needleAngle = angle;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateCompassRect();
  }

  private updateCompassRect(): void {
    if (this.compassElement) {
      this.compassRect = this.compassElement.nativeElement.getBoundingClientRect();
    }
  }
}
