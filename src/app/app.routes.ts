import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/hero/hero.component').then(m => m.HeroComponent),
    title: 'Ali Hage Hassan - Maritime Engineering'
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent),
    title: 'About - Ali Hage Hassan'
  },
  {
    path: 'experience',
    loadComponent: () => import('./components/experience/experience.component').then(m => m.ExperienceComponent),
    title: 'Experience - Ali Hage Hassan'
  },
  {
    path: 'education',
    loadComponent: () => import('./components/education/education.component').then(m => m.EducationComponent),
    title: 'Education - Ali Hage Hassan'
  },
  {
    path: 'skills',
    loadComponent: () => import('./components/skills/skills.component').then(m => m.SkillsComponent),
    title: 'Skills - Ali Hage Hassan'
  },
  {
    path: 'certifications',
    loadComponent: () => import('./components/certifications/certifications.component').then(m => m.CertificationsComponent),
    title: 'Certifications - Ali Hage Hassan'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
