import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Suggestion } from '../../models/suggestion';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {
  suggestionUrl = 'http://localhost:3000/suggestions';

  constructor(private http: HttpClient) {}

  private normalizeSuggestion(item: any): Suggestion {
    return {
      id: Number(item.id),
      title: item.title,
      description: item.description,
      category: item.category,
      date: new Date(item.date),
      status: item.status,
      nbLikes: Number(item.nbLikes) || 0
    };
  }

  getSuggestionsList(): Observable<Suggestion[]> {
    return this.http
      .get<any[]>(this.suggestionUrl)
      .pipe(map(items => items.map(item => this.normalizeSuggestion(item))));
  }

  getSuggestionById(id: number): Observable<Suggestion> {
    return this.http.get<any>(`${this.suggestionUrl}/${id}`).pipe(
      map(response => this.normalizeSuggestion(response.suggestion ?? response))
    );
  }

  deleteSuggestion(id: number): Observable<any> {
    return this.http.delete(`${this.suggestionUrl}/${id}`);
  }

  addSuggestion(suggestion: Partial<Suggestion>): Observable<any> {
    return this.http.post(this.suggestionUrl, {
      title: suggestion.title,
      description: suggestion.description,
      category: suggestion.category,
      status: suggestion.status ?? 'en_attente'
    });
  }

  updateSuggestion(id: number, suggestion: Suggestion): Observable<any> {
    return this.http.put(`${this.suggestionUrl}/${id}`, {
      title: suggestion.title,
      description: suggestion.description,
      category: suggestion.category,
      status: suggestion.status,
      nbLikes: suggestion.nbLikes
    });
  }

  updateSuggestionLikes(id: number): Observable<any> {
    return this.http.post(`${this.suggestionUrl}/${id}/like`, {});
  }
}
