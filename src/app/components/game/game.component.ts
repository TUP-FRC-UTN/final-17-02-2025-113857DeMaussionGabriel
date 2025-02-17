import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Word } from '../../interfaces/model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
  keys: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  word: string = '';
  words: Word[] = [];
  attemptsLeft: number = 0;
  guessedLetters: string[] = [];
  gameId: string = '';
  gameStatus: string = '';

  
  constructor(
    private readonly apiService: ApiService
  ) { }


  ngOnInit(): void {
    this.resetGame()
  }

  
  submitLetter(letter: string) {
    if(this.gameStatus !== '') return;
    
    console.log('Letra presionada:', letter);
    this.guessedLetters.push(letter);
    if (this.word.includes(letter)) {
      console.log('La letra esta en la palabra');
    } else {
      console.log('La letra no está en la palabra');
      this.attemptsLeft--;
    }

    this.checkCondition();
  }

  
  loadWord() {
    this.apiService.getWords().subscribe({
      next: (response) => {
        this.words = response;

        let randomIndex = Math.floor(Math.random() * this.words.length);
        this.word = this.words[randomIndex].word.toUpperCase();
        console.log('Palabra seleccionada:', this.word);

      },
      error: (error) => {
        console.log('Error cargando las palabras');
        console.error(error)
      }
    })
  }

  
  resetGame() {
    this.attemptsLeft = 6;
    this.guessedLetters = [];
    this.loadWord();
    this.gameId = this.generateGameId();
    this.gameStatus = '';
  }

  
  checkCondition() {
    if (this.attemptsLeft === 0) {
      this.submitScore();
      this.gameStatus=`Derrota (${this.getScore()} Puntos)`;
    }
    if (this.word.split('').every(letter => this.guessedLetters.includes(letter))) {
      this.submitScore();
      this.gameStatus=`Victoria (${this.getScore()} Puntos)`;
    }
  }

  
  submitScore() {
    let user = JSON.parse(localStorage.getItem('user')!);

    let score: any = {
      playerName: user.name,
      word: this.word,
      attemptsLeft: this.attemptsLeft,
      score: this.getScore(),
      date: new Date().toISOString(),
      idGame: this.gameId,
    }

    console.log('Puntuacion:', score);
    this.apiService.submitScore(score).subscribe({
      next: (response) => {
        console.log('Puntuacion enviada');
      },
      error: (error) => {
        console.log('Error enviando la puntuacion');
        console.error(error);
      }
    })
  }

  
  getScore() {
    let scores: number[] = [0, 10, 20, 40, 60, 80, 100];

    return scores[this.attemptsLeft];
  }

  
  generateGameId() {
    let user = JSON.parse(localStorage.getItem('user')!);

    this.apiService.getScoresByUser(user.name!).subscribe({
      next: (response) => {
        console.log('Juegos del usuario:', response);

        let amountOfGames = (response.length + 1);
        let initials = user.name!.split(' ').map((key: string) => key.charAt(0)).join('');

        let gameId = ('P' + amountOfGames + initials).toLocaleUpperCase();

        this.gameId = gameId;
        console.log('Id de juego generado:', gameId);
      },
      error: (error) => {
        console.log('Error generando el id de juego');
        console.error(error)
        if (error.status === 404) {
          console.log('No se encontraron juegos para el usuario');

          let initials = user.name!.split(' ').map((key: string) => key.charAt(0)).join('');

          let gameId = ('P' + 1 + initials).toLocaleUpperCase();

          this.gameId = gameId;
          console.log('Id de juego generado:', gameId);
        }
      }
    })

    return '';
  }
  
  
  getLetterClass(letter: string) {
    if (this.guessedLetters.includes(letter)) {
      return this.word.includes(letter) ? 'btn-success' : 'btn-danger';
    }
    return 'btn-outline-primary'
  }


}
