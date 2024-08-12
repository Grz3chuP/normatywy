import {Component, inject, ViewChild} from '@angular/core';
import {MatFormField, MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {ZapiszZapytajService} from "../services/zapisz-zapytaj.service";
import {loading} from "../services/loading";
import {FormsModule} from "@angular/forms";
import {AgGridAngular} from "ag-grid-angular";
import {ColDef, ColGroupDef, GridOptions} from "ag-grid-community";
import { AG_GRID_LOCALE_PL } from '@appiec/ag-grid-locale-pl';


@Component({
  selector: 'app-przewodniki',
  standalone: true,
  imports: [
    MatInput,
    MatFormField,
    MatButton,
    FormsModule,
    AgGridAngular
  ],
  templateUrl: './przewodniki.component.html',
  styleUrl: './przewodniki.component.css'
})
export class PrzewodnikiComponent {
  @ViewChild('agGrid') grid!: AgGridAngular;


private serwis = inject(ZapiszZapytajService);
  protected readonly loading = loading;
  gridOptions: GridOptions;
  columnDefs: (ColDef|ColGroupDef)[];

daneDoZapytania = {
  znak: "",
  bezKWN: true
}
constructor() {
  this.columnDefs = [

    {
      headerName: 'lp',
      filter: 'agSetColumnFilter',  // Text, Number, Set, Date
      width: 90,
      valueGetter: params =>   params.node!.id!

    },
    {
      headerName: "numer przewodnika",
      field: "numer_przewodnika",
      filter: "agTextColumnFilter",
      width: 150,

    }, {
      headerName: "oznaczenie",
      field: "oznaczenie_literowe",
      filter: "agTextColumnFilter",
      width: 150
    }, {
      headerName: "numer",
      field: "oznaczenie_numeryczne",
      filter: "agTextColumnFilter",
      width: 150
    },
    {
      headerName: "koniec",
      field: "oznaczenie_koncowe",
      filter: "agTextColumnFilter",
      width: 150
    },
    {
      headerName: "numer rysunku",
      field: "numer_rysunku",
      filter: "agTextColumnFilter",
      width: 200
    },
    {
      headerName: "nazwa rysunku",
      field: "nazwa_rysunku",
      filter: "agTextColumnFilter",
      width: 230
    },
    {
      headerName: "nazwa rysunku wszystkie",
      field: "tekst_numery_rysunkow",
      filter: "agTextColumnFilter",
      width: 210
    },
    {
      headerName: "materiał",
      field: "tekst_material",
      filter: "agTextColumnFilter",
      width: 210
    },
    {
      headerName: "masa materiału",
      field: "masa_materialu",
      filter: "agTextColumnFilter",
      width: 100
    },
    {
      headerName: "masa",
      field: "masa",
      filter: "agTextColumnFilter",
      width: 100
    },
  ];
  this.gridOptions = {
    columnDefs: this.columnDefs,

    // enableServerSideSorting: true,
    // enableServerSideFilter: true,
    localeText: AG_GRID_LOCALE_PL,
    rowSelection: 'single',
    enableRangeSelection: true,
    // rowModelType: 'infinite',
    // paginationPageSize: this.parametryInfiniteScroll.rozmiarStrony,
    // cacheOverflowSize: 2,
    // maxConcurrentDatasourceRequests: 2,
    // infiniteInitialRowCount: 1,
    // maxBlocksInCache: 4,
    defaultColDef: {
      sortable: true,
      resizable: true,
      floatingFilter: true
    },
    onGridReady: (params: any) => {
    this.grid.api.setGridOption('rowData', []);
    },
    //onSelectionChanged: selectionChange,
    onCellDoubleClicked: (params: any) => {
      //this.wejdzDoEdycji(params)
    },
    // getRowNodeId: item => item.id,
    animateRows: true,
    onCellValueChanged: null,
    getRowStyle: null,
    // getRowNodeId: item => item.lp,
  } as unknown as GridOptions;
}

wczytajPrzewodniki() {
loading.set(true);
this.serwis.zapytaj_o('przewodniki', {znak: this.daneDoZapytania.znak, bezKWN: this.daneDoZapytania.bezKWN})
  .subscribe({
    next: dane => {
      loading.set(false);
      this.grid.api.setGridOption('rowData', dane.przewodniki);

    },
    error:(e) => {
      loading.set(false);
      this.serwis.errorhandler(e);
    }
  })
}


}
