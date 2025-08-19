import { Component, inject, OnInit } from '@angular/core';
import { NavigationService } from '../../../../shared/navigation.service';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-profile-main',
  templateUrl: './profile-main.component.html',
  styleUrl: './profile-main.component.scss'
})
export class ProfileMainComponent implements OnInit{
  public navigationService = inject(NavigationService);
  private userService = inject(UserService);

  isLoading = true;
  user: User | null = null;

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.isLoading = true;
    this.userService.getCurrentUserDetails().subscribe({
      next: (userData) => {
        this.user = userData;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar dados do perfil', err);
        this.isLoading = false;
      }
    });
  }
}
