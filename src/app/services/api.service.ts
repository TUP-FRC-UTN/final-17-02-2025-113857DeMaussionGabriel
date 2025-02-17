import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Score, User, Word } from '../interfaces/model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private readonly http: HttpClient) { }
  
  getScores(){
    return this.http.get<Score[]>('https://671fe287e7a5792f052fdf93.mockapi.io/scores');
  }
  
  getScoresByUser(playerName: string){
    return this.http.get<Score[]>('https://671fe287e7a5792f052fdf93.mockapi.io/scores?playerName='+ playerName);
  }
  
  login(email: string, password: string){
    return this.http.get<User[]>('https://679b8dc433d31684632448c9.mockapi.io/users?username=' + email + '&password=' + password);
  }
  
  getWords(){
    return this.http.get<Word[]>('https://671fe287e7a5792f052fdf93.mockapi.io/words');
  }
  
  submitScore(score: Score){
    return this.http.post<Score>('https://671fe287e7a5792f052fdf93.mockapi.io/scores', score);
  }
}
