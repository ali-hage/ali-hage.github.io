import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { CompassComponent } from '../compass';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';
import { Experience } from '../../core/models';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, CompassComponent],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExperienceComponent implements OnInit {
  private portfolioService = inject(PortfolioDataService);
  
  experiences: Experience[] = [];

  ngOnInit(): void {
    this.portfolioService.getExperience().subscribe(exp => {
      this.experiences = exp;
    });
  }
}
