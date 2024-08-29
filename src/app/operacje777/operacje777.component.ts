import {Component, inject} from '@angular/core';
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {ZapiszZapytajService} from "../services/zapisz-zapytaj.service";
import {loading} from "../services/loading";
import {MatSelect} from "@angular/material/select";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-operacje777',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatAutocompleteTrigger,
    MatOption,
    MatAutocomplete,
    MatSelect,
    MatButton
  ],
  templateUrl: './operacje777.component.html',
  styleUrl: './operacje777.component.css'
})
export class Operacje777Component {

  private serwis = inject(ZapiszZapytajService);
  wyroby :{wyrob: string}[] = [] ;

  constructor() {
    this.wczytajWyroby();
  }

  private wczytajWyroby() {
    loading.set(true);

    this.serwis.zapytaj_o('wyroby', {})
      .subscribe({
        next: dane => {
          loading.set(false);
          this.wyroby = dane;
        },
        error: err => {
          loading.set(false);
          this.serwis.errorhandler(err);
        }
      })
  }
}
