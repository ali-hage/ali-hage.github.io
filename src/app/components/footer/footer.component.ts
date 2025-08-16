import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';
import { SocialLink } from '../../core/models';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {
  private portfolioService = inject(PortfolioDataService);
  
  socialLinks: SocialLink[] = [];
  currentYear: number = new Date().getFullYear();

  ngOnInit(): void {
    this.portfolioService.getSocialLinks().subscribe(links => {
      this.socialLinks = links;
    });
  }

  scrollToTop(): void {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  }
}