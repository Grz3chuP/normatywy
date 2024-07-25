import {Component, inject} from '@angular/core';
import {MatFormField, MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {ZapiszZapytajService} from "../services/zapisz-zapytaj.service";

@Component({
  selector: 'app-przewodniki',
  standalone: true,
  imports: [
    MatInput,
    MatFormField,
    MatButton
  ],
  templateUrl: './przewodniki.component.html',
  styleUrl: './przewodniki.component.css'
})
export class PrzewodnikiComponent {
private serwis = inject(ZapiszZapytajService);
constructor() {
}

wczytajPrzewodniki() {

}
}
