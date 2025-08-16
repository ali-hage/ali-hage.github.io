import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  private router = inject(Router);
  
  personalInfo: PersonalInfo | null = null;

  ngOnInit(): void {
    this.portfolioService.getPersonalInfo().subscribe(info => {
      this.personalInfo = info;
    });
  }


  navigateToAbout(): void {
    this.router.navigate(['/about']);
  }
}
