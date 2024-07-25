import { Routes } from '@angular/router';

import {PrzewodnikiComponent} from "./przewodniki/przewodniki.component";
import {MenuComponent} from "./menu/menu/menu.component";
import {WyrobyComponent} from "./wyroby/wyroby.component";
import {AppComponent} from "./app.component";

export const routes: Routes = [
  {path: 'index', component: AppComponent, children: [
      {path: 'start', component: MenuComponent, children: [
          {path: 'przewodniki', component: PrzewodnikiComponent},
          {path: 'wyroby', component: WyrobyComponent}
        ]}

    ]

  }
];
