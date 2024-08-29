import { Routes } from '@angular/router';

import {PrzewodnikiComponent} from "./przewodniki/przewodniki.component";
import {MenuComponent} from "./menu/menu/menu.component";
import {WyrobyComponent} from "./wyroby/wyroby.component";
import {AppComponent} from "./app.component";
import {StrukturaComponent} from "./wyroby/struktura/struktura.component";
import {Operacje777Component} from "./operacje777/operacje777.component";

export const routes: Routes = [
  {path: 'index', component: AppComponent, children: [
      {path: 'start', component: MenuComponent, children: [
          {path: 'przewodniki', component: PrzewodnikiComponent},
          {path: 'wyroby', component: WyrobyComponent},
          {path: 'struktura', component: StrukturaComponent},
          {path: 'wyroby/operacje777', component: Operacje777Component}

        ]}

    ]

  }
];
