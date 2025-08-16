import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShipGameComponent } from '../ship-game/ship-game.component';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';
import { PersonalInfo } from '../../core/models';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, ShipGameComponent],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent implements OnInit {
  private portfolioService = inject(PortfolioDataService);
  
  personalInfo: PersonalInfo | null = null;

  ngOnInit(): void {
    this.portfolioService.getPersonalInfo().subscribe(info => {
      this.personalInfo = info;
    });
  }


  scrollToAbout(): void {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
