import { Component, OnInit } from '@angular/core';
import { Score, User } from '../../interfaces/model';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-scores',
  imports: [],
  templateUrl: './scores.component.html',
  styleUrl: './scores.component.css'
})
export class ScoresComponent implements OnInit {
  scores: Score[] = [];
  title = '';

  constructor(
    private readonly apiService: ApiService
  ) { }

  ngOnInit() {
    this.loadScores();
  }

  loadScores() {
    let user: User = JSON.parse(localStorage.getItem('user')!);
    console.log(user);
    
    if (user.role === 'admin') {
      this.title = 'Puntuaciones totales';
      this.apiService.getScores().subscribe({
        next: (response) => {
          this.scores = response
        },
        error: (error) => {
          console.log('Error cargando las puntuaciones');
          console.error(error)
        }
      })
    }
    else {
      this.title = 'Mis Puntuaciones';
      this.apiService.getScoresByUser(user.name!).subscribe({
        next: (response) => {
          this.scores = response
        },
        error: (error) => {
          console.log('Error cargando las puntuaciones');
          console.error(error)
        }
      })
    }

  }





}
