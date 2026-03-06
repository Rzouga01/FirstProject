import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SuggestionService } from '../../../core/Services/suggestion.service';
import { Suggestion } from '../../../models/suggestion';

@Component({
  selector: 'app-suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrl: './suggestion-form.component.css'
})
export class SuggestionFormComponent implements OnInit {
  suggestionForm!: FormGroup;
  id: number | null = null;
  isEditMode: boolean = false;
  
  categories: string[] = [
    'Infrastructure et bâtiments',
    'Technologie et services numériques',
    'Restauration et cafétéria',
    'Hygiène et environnement',
    'Transport et mobilité',
    'Activités et événements',
    'Sécurité',
    'Communication interne',
    'Accessibilité',
    'Autre'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private actR: ActivatedRoute,
    private service: SuggestionService
  ) {}

  ngOnInit(): void {
    this.suggestionForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('^[A-Z][a-zA-Z\\s\']*$')
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(30)
      ]],
      category: ['', Validators.required],
      date: [{ value: new Date().toISOString().split('T')[0], disabled: true }],
      status: [{ value: 'en_attente', disabled: false }],
      nbLikes: [0]
    });

    const idParam = this.actR.snapshot.params['id'];
    this.id = idParam ? Number(idParam) : null;
    this.isEditMode = this.id !== null && !Number.isNaN(this.id);

    if (this.isEditMode && this.id !== null) {
      this.service.getSuggestionById(this.id).subscribe((data) => {
        this.suggestionForm.patchValue({
          title: data.title,
          description: data.description,
          category: data.category,
          date: this.formatDate(data.date),
          status: data.status,
          nbLikes: data.nbLikes
        });
      });
    }
  }

  onSubmit(): void {
    if (!this.suggestionForm.valid) {
      return;
    }

    const formValue = this.suggestionForm.getRawValue();
    const suggestion: Suggestion = {
      id: this.id ?? 0,
      title: formValue.title,
      description: formValue.description,
      category: formValue.category,
      date: new Date(formValue.date),
      status: formValue.status,
      nbLikes: Number(formValue.nbLikes) || 0
    };

    if (this.isEditMode && this.id !== null) {
      this.service.updateSuggestion(this.id, suggestion).subscribe(() => {
        this.router.navigate(['/suggestions/suggestionslist']);
      });
      return;
    }

    this.service.addSuggestion(suggestion).subscribe(() => {
      this.router.navigate(['/suggestions/suggestionslist']);
    });
  }

  private formatDate(value: Date | string): string {
    const date = new Date(value);
    return date.toISOString().split('T')[0];
  }

  get title() { return this.suggestionForm.get('title'); }
  get description() { return this.suggestionForm.get('description'); }
  get category() { return this.suggestionForm.get('category'); }
}