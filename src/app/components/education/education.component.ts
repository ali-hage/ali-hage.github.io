import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectionStrategy, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';
import { Education } from '../../core/models';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf],
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EducationComponent implements OnInit, AfterViewInit, OnDestroy {
  private portfolioService = inject(PortfolioDataService);
  education: Education[] = [];
  
  @ViewChild('educationSection', { static: false }) sectionRef?: ElementRef<HTMLElement>;
  @ViewChild('rigPlatform', { static: false }) rigRef?: ElementRef<HTMLElement>;
  
  private scrollListener?: () => void;

  ngOnInit(): void {
    this.portfolioService.getEducation().subscribe(edu => {
      this.education = edu;
    });
  }
  
  ngAfterViewInit(): void {
    this.initScrollAnimation();
  }
  
  ngOnDestroy(): void {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }
  
  private initScrollAnimation(): void {
    if (!this.sectionRef?.nativeElement) return;
    
    this.scrollListener = () => {
      this.updateAnimation();
    };
    
    window.addEventListener('scroll', this.scrollListener, { passive: true });
    this.updateAnimation(); // Initial call
  }
  
  private updateAnimation(): void {
    const section = this.sectionRef?.nativeElement;
    if (!section) return;
    
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate scroll progress (0 to 1) based on section visibility
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    
    // Simple scroll progress: 0 when section is below viewport, 1 when fully visible
    let scrollProgress = 0;
    if (sectionTop < windowHeight) {
      scrollProgress = Math.min(1, (windowHeight - sectionTop) / (sectionHeight * 1.2));
    }
    
    // Update CSS custom properties for animations
    section.style.setProperty('--scroll-progress', scrollProgress.toString());
    
    // Animate education items rising up
    const eduItems = section.querySelectorAll('.edu-item');
    eduItems.forEach((item, index) => {
      const delay = index * 0.2; // Slower stagger so hook can follow each item
      const itemProgress = Math.max(0, Math.min(1, (scrollProgress - delay) * 1.5));
      (item as HTMLElement).style.setProperty('--item-progress', itemProgress.toString());
    });
  }
}
