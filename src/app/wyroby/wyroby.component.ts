import {Component, inject} from '@angular/core';
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {ZapiszZapytajService} from "../services/zapisz-zapytaj.service";
import {loading} from "../services/loading";
import {MatButton} from "@angular/material/button";
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wyroby',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatAutocomplete,
    MatOption,
    MatAutocompleteTrigger,
    MatButton,
    FormsModule
  ],
  templateUrl: './wyroby.component.html',
  styleUrl: './wyroby.component.css'
})
export class WyrobyComponent {
 private serwis = inject(ZapiszZapytajService);

 wyroby :{wyrob: string}[] = [] ;
 zawartosc :string[] = [];
 wybranyWyrob :string = '';
 constructor(private toastr: ToastrService) {
   this.wczytajWyroby()
 }

  wczytajWyroby() {
    loading.set(true);
    this.serwis.zapytaj_o('wyroby', {})
      .subscribe({
        next: dane => {
          loading.set(false);
           this.wyroby = dane;
        },
        error:(e) => {
          loading.set(false);
          this.serwis.errorhandler(e);
        }
      })
  }

  dodajDoAnalizy() {
   if(!this.wybranyWyrob) {
     this.toastr.error('Nie wskazano wyrobu!');
     return
   }
    loading.set(true);
   let wyrob = this.wybranyWyrob;
   if(this.zawartosc.find((e: any) => e === wyrob)) {
     this.toastr.error('Taki wyr\xf3b ju\u017c jest umieszczony w analizie')
     loading.set(false);
     return
   }
    this.serwis.zapytaj_o('szczegolowe_dane_wyrobu', {wyrob: this.wybranyWyrob})
      .subscribe({
        next: dane => {
          loading.set(false);
         this.zawartosc.push(this.wybranyWyrob);
        },
        error:(e) => {
          loading.set(false);
          this.serwis.errorhandler(e);
        }
      })
  }
}
