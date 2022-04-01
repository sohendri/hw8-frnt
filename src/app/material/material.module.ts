import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

const MaterialComponents = [
  MatAutocompleteModule,
  MatFormFieldModule,
  MatInputModule
]

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule { }
