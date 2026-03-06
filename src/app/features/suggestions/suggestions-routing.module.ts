import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SuggestionsComponent } from './suggestions.component';
import { ListSuggestionComponent } from './list-suggestion/list-suggestion.component';
import { SuggestionDetailsComponent } from './suggestion-details/suggestion-details.component';
import { SuggestionFormComponent } from './suggestion-form/suggestion-form.component';

const routes: Routes = [
  { path: '', component: SuggestionsComponent },
  { path: 'suggestionslist', component: ListSuggestionComponent },
  { path: 'suggestionslist/:id', component: SuggestionDetailsComponent },
  { path: 'suggestion-form', component: SuggestionFormComponent },
  { path: 'suggestion-form/:id', component: SuggestionFormComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuggestionsRoutingModule { }
