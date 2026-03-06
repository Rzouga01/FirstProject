import { Component, OnInit } from '@angular/core';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/Services/suggestion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-suggestion',
  templateUrl: './list-suggestion.component.html',
  styleUrls: ['./list-suggestion.component.css']
})
export class ListSuggestionComponent implements OnInit {
  allSuggestions: Suggestion[] = [];
  suggestions: Suggestion[] = [];
  favSuggestions: Suggestion[] = [];
  searchTerm: string = '';

  constructor(
    private suggestionService: SuggestionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSuggestions();
  }

  loadSuggestions(): void {
    this.suggestionService.getSuggestionsList().subscribe(data => {
      this.allSuggestions = data;
      this.search();
    });
  }

  addFav(suggestion: Suggestion): void {
    if (!this.favSuggestions.includes(suggestion)) {    
    this.favSuggestions.push(suggestion);
  }
  }

   addLike(suggestion: Suggestion): void {
    this.suggestionService.updateSuggestionLikes(suggestion.id).subscribe(() => {
      suggestion.nbLikes++;
    });
  }

  deleteSuggestion(id: number): void {
    this.suggestionService.deleteSuggestion(id).subscribe(() => {
      this.loadSuggestions();
      this.router.navigate(['/suggestions/suggestionslist']);
    });
  }

  search(): void {
    if (!this.searchTerm) {
      this.suggestions = this.allSuggestions;
    } else {
      this.suggestions = this.allSuggestions.filter(suggestion =>
        suggestion.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        suggestion.category.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  
}
