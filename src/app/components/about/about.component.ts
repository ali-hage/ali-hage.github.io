import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { LighthouseComponent } from '../lighthouse';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';
import { PersonalInfo, CoreValue } from '../../core/models';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, NgFor, LighthouseComponent],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements OnInit {
  private portfolioService = inject(PortfolioDataService);
  
  personalInfo: PersonalInfo | null = null;
  coreValues: CoreValue[] = [];

  ngOnInit(): void {
    this.portfolioService.getPersonalInfo().subscribe(info => {
      this.personalInfo = info;
    });

    this.portfolioService.getCoreValues().subscribe(values => {
      this.coreValues = values;
    });
  }
}
