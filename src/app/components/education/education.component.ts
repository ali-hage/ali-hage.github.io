import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
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
export class EducationComponent implements OnInit {
  private portfolioService = inject(PortfolioDataService);
  education: Education[] = [];

  ngOnInit(): void {
    this.portfolioService.getEducation().subscribe(edu => {
      this.education = edu;
    });
  }
}
