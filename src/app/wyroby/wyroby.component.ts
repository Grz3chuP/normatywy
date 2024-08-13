import {Component, inject, ViewChild} from '@angular/core';
import {MatFormField, MatInput} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {ZapiszZapytajService} from "../services/zapisz-zapytaj.service";
import {loading} from "../services/loading";
import {MatButton} from "@angular/material/button";
import {ToastrModule, ToastrService} from 'ngx-toastr';

import {AgGridAngular} from "ag-grid-angular";
import {ColDef, ColGroupDef, GridOptions} from "ag-grid-community";
import {AG_GRID_LOCALE_PL} from "@appiec/ag-grid-locale-pl";
import {IStanowiska} from "../interfaces/IStanowiska";
import {MatCard} from "@angular/material/card";
import {Nl2brPipe} from "../services/nl2br.pipe";

@Component({
  selector: 'app-wyroby',
  standalone: true,
  imports: [
    MatInput,
    ReactiveFormsModule,
    MatAutocomplete,
    MatOption,
    MatAutocompleteTrigger,
    MatButton,
    FormsModule,
    AgGridAngular,
    MatFormField,
    MatCard,
    Nl2brPipe
  ],
  templateUrl: './wyroby.component.html',
  styleUrl: './wyroby.component.css'
})
export class WyrobyComponent {

  @ViewChild('agGrid') grid!: AgGridAngular;
 private serwis = inject(ZapiszZapytajService);

  gridOptions: GridOptions;
  columnDefs: (ColDef|ColGroupDef)[];
 stanowiska :IStanowiska;
 wyroby :{wyrob: string}[] = [] ;
 zawartosc :string[] = [];
 wybranyWyrob :string = '';
   tablica_nazw_grup: any;
  _suma_tpz :number = 0;
  suma_tj :number = 0;
  tresc :string = '';
 constructor(private toastr: ToastrService) {
   this.wczytajWyroby();
this.stanowiska = {};
   let o = (t: any)=>"E" === t.value ? "Element" : "P" === t.value ? "Podzesp\xf3\u0142" : "W" === t.value ? "Wyr\xf3b" : "";
   const S = {
     rozk: "Rozkrój",
     czys: "Czyszczenie",
     obro: "Obróbka Elementów",
     sppo: "Spawanie Podzespołów",
     podz: "Obróbka Podzespołów",
     spaw: "Spawanie Wyrobów",
     obze: "Obróbka Wyrobów",
     paos: "Pakowanie/Ślusarnia",
     malo: "Malowanie"
   };

   this.columnDefs = [{
     headerName: "Lp",
     width: 80,
     cellRenderer: (t: any) => (parseInt(t.node.childIndex, 10) + 1).toString(),
     valueGetter: (t: any) => (t.node.childIndex + 1).toString(),
     filter: !1,
     sortable: !1,
     chartDataType: "excluded"
   }, {
     headerName: "Wyr\xf3b",
     field: "wyrob",
     filter: "agSetColumnFilter",
     filterParams: {},
     cellRenderer: null,
     width: 380,
     chartDataType: "category"
   }, {
     headerName: "Kategoria",
     field: "kategoria",
     filter: "agSetColumnFilter",
     filterParams: {
       cellRenderer: o,
       values: ["W", "P", "E"]
     },
     cellRenderer: o,
     width: 120,
     chartDataType: "category"
   }, {
     headerName: "Przewodnik",
     field: "numer_przewodnika",
     filter: "agTextColumnFilter",
     filterParams: {},
     cellRenderer: null,
     width: 120,
     chartDataType: "excluded"
   }, {
     headerName: "szt/kpl",
     field: "ilosc_szt",
     filter: "agNumberColumnFilter",
     filterParams: {},
     cellRenderer: null,
     width: 120,
     chartDataType: "excluded"
   }, {
     headerName: "Tpz",
     field: "tpz",
     filter: "agNumberColumnFilter",
     filterParams: {},
     cellRenderer: null,
     width: 100,
     chartDataType: "excluded"
   }, {
     headerName: "Tj",
     field: "tj",
     filter: "agNumberColumnFilter",
     filterParams: {},
     cellRenderer: null,
     width: 100,
     chartDataType: "excluded"
   }, {
     headerName: "Tj na kpl",
     field: "tj_na_kpl",
     valueGetter: t=>(t.data.tj * t.data.ilosc_szt).toFixed(1),
     filter: "agNumberColumnFilter",
     filterParams: {},
     cellRenderer: null,
     width: 100,
     chartDataType: "series"
   }, {
     headerName: "Operacja",
     field: "operacja",
     filter: "agNumberColumnFilter",
     filterParams: {},
     cellRenderer: null,
     width: 120,
     chartDataType: "excluded"
   }, {
     headerName: "Stanowisko",
     field: "stanowisko",
     filter: "agSetColumnFilter",
     filterParams: {
       newRowsAction: "keep"
     },
     cellRenderer: null,
     width: 110,
     chartDataType: "category"
   }, {
     headerName: "Etap",
     field: "etap",
     filter: "agSetColumnFilter",
     filterParams: {
       newRowsAction: "keep",
       values: [S.rozk, S.czys, S.obro, S.sppo, S.podz, S.spaw, S.obze, S.paos, S.malo, "Inne"]
     },
     valueGetter: t=>{
       if (!this.stanowiska[t.data.stanowisko])
         return "-";
       let e = this.stanowiska[t.data.stanowisko];
       if ("E" === t.data.kategoria) {
         if ("rozk" === e.typ_elementy)
           return S.rozk;
         if ("czys" === e.typ_elementy)
           return S.czys;
         if ("obro" === e.typ_elementy)
           return S.obro
       } else {
         if ("P" === t.data.kategoria)
           return "spaw" === e.typ_montaz ? S.sppo : S.podz;
         if ("spaw" === e.typ_montaz)
           return S.spaw;
         if ("Z11" === e.stanowisko || "Z10" === e.stanowisko)
           return S.paos;
         if ("obze" === e.typ_montaz)
           return S.obze;
         if ("malo" === e.typ_montaz)
           return S.malo
       }
       return "Inne"
     }
     ,
     cellRenderer: null,
     width: 140,
     chartDataType: "category"
   }, {
     headerName: "Stanowisko nazwa",
     valueGetter: t => this.stanowiska[t.data.stanowisko] ? this.stanowiska[t.data.stanowisko].nazwa : "-",
     filter: "agSetColumnFilter",
     filterParams: {
       newRowsAction: "keep"
     },
     cellRenderer: null,
     width: 180,
     resizable: !0,
     field: "stanowisko_nazwa",
     chartDataType: "category"
   }, {
     headerName: "Grupa stanowiska",
     valueGetter: t=>this.stanowiska[t.data.stanowisko] ? this.tablica_nazw_grup[this.stanowiska[t.data.stanowisko].grupa] : "-",
     filter: "agSetColumnFilter",
     filterParams: {
       newRowsAction: "keep"
     },
     cellRenderer: null,
     width: 180,
     resizable: !0,
     field: "stanowisko_grupa",
     chartDataType: "category"
   }];

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
       this.inicjujFiltr();

     },

     onFilterChanged: (t: any)=>{
       this.przelicz_tpz_tj()
     },

     onSelectionChanged: (t: any)=>{
       let e = this.grid.api.getSelectedNodes();
       this.tresc = e.length <= 0 ? null : e[0].data.tresc
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
          this.stanowiska = {};
            dane.stanowiska.forEach((t: any)=> {
              this.stanowiska[t.stanowisko] = t;
            })
          this.tablica_nazw_grup = dane.tablica_nazw_grup;
            this.dodaj_dane_do_grida(dane);

            this.wybranyWyrob = "";
            this.przelicz_tpz_tj();
        },
        error:(e) => {
          loading.set(false);
          this.serwis.errorhandler(e);
        }
      })
  }
  inicjujFiltr() {
    this.grid.api.setFilterModel({
      operacja: {
        filter: 700,
        filterType: "number",
        type: "lessThan"
      }
    })
  }
  dodaj_dane_do_grida(dane: any) {
    let e: any[] = [];
    dane.dane.przewodniki_wyrobu.forEach((t: any)=>{
        let n = t.operacje.map((e: any)=>Object.assign({
          wyrob: t.wyrob,
          przewodnik: t.numer_przewodnika,
          kategoria: t.kategoria,
          ilosc_szt: t.ilosc_szt,
          material: t.material ? `${t.material.nazwa_materialu} - ${t.material.gatunek}` : ""
        }, e));
        e = e.concat(n)
      }
    );
      this.grid.api.applyTransaction({
        add: e
      })
      // this.grid.api.getnFilterInstance("wyrob").resetFilterValues(),
      // this.grid.api.getFilterInstance("stanowisko").resetFilterValues(),
      // this.grid.api.getFilterInstance("stanowisko_nazwa").resetFilterValues(),
      // this.grid.api.getFilterInstance("stanowisko_grupa").resetFilterValues()
  }
  przelicz_tpz_tj() {
    let t = 0
      , e = 0;
    this.grid.api.forEachNodeAfterFilter(n=>{
        t += n.data.tpz;
          e += n.data.tj * n.data.ilosc_szt
      }
    ),
      t = +(t / 60).toFixed(1);
      e = +(e / 60).toFixed(2);
      this._suma_tpz = t;
      this.suma_tj = e
  }

  czyscAnalize() {
   this.zawartosc = [];
   this.suma_tj = 0;
   this._suma_tpz = 0;
   this.grid.api.setGridOption("rowData", []);
  }

  protected readonly loading = loading;
}
