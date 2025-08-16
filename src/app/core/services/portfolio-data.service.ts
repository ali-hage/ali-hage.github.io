import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PortfolioData } from '../models';
import { PORTFOLIO_DATA } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class PortfolioDataService {
  private readonly portfolioData: PortfolioData = PORTFOLIO_DATA;

  /**
   * Get complete portfolio data
   */
  getPortfolioData(): Observable<PortfolioData> {
    return of(this.portfolioData);
  }

  /**
   * Get personal information
   */
  getPersonalInfo() {
    return of(this.portfolioData.personalInfo);
  }

  /**
   * Get navigation items
   */
  getNavigation() {
    return of(this.portfolioData.navigation);
  }

  /**
   * Get core values
   */
  getCoreValues() {
    return of(this.portfolioData.coreValues);
  }

  /**
   * Get work experience
   */
  getExperience() {
    return of(this.portfolioData.experience);
  }

  /**
   * Get education history
   */
  getEducation() {
    return of(this.portfolioData.education);
  }

  /**
   * Get skills by categories
   */
  getSkills() {
    return of(this.portfolioData.skills);
  }

  /**
   * Get social links
   */
  getSocialLinks() {
    return of(this.portfolioData.socialLinks);
  }

}