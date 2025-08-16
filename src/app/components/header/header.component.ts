import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';
import { NavigationItem } from '../../core/models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  private portfolioService = inject(PortfolioDataService);
  
  navigation: NavigationItem[] = [];

  ngOnInit(): void {
    this.portfolioService.getNavigation().subscribe(nav => {
      this.navigation = nav;
    });
  }

}
