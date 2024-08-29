import {Component, inject, ViewChild} from '@angular/core';
import {AgGridAngular} from "ag-grid-angular";
import {ZapiszZapytajService} from "../../services/zapisz-zapytaj.service";
import {ColDef, ColGroupDef, GridOptions} from "ag-grid-community";
import {AG_GRID_LOCALE_PL} from "@appiec/ag-grid-locale-pl";
import {loading} from "../../services/loading";

@Component({
  selector: 'app-struktura',
  standalone: true,
    imports: [
        AgGridAngular
    ],
  templateUrl: './struktura.component.html',
  styleUrl: './struktura.component.css'
})
export class StrukturaComponent {
  @ViewChild('agGrid') grid!: AgGridAngular;
  private serwis = inject(ZapiszZapytajService);

  gridOptions: GridOptions;
  columnDefs: (ColDef | ColGroupDef)[];

  constructor() {

    // let Gn = (()=>{
    //   class t {
    //     constructor() {}
    //     agInit(t) {
    //       this.wyrob = t.data.wyrob
    //     }
    //     refresh(t) {
    //       return !1
    //     }
    //   }
    //   return t.\u0275fac = function(e) {
    //     return new (e || t)
    //   }
    //     ,
    //     t.\u0275cmp = r.Ib({
    //       type: t,
    //       selectors: [["app-wyrob-akcja"]],
    //       decls: 2,
    //       vars: 3,
    //       consts: [["routerLink", "podzial", 3, "queryParams"]],
    //       template: function(t, e) {
    //         1 & t && (r.Tb(0, "a", 0),
    //           r.tc(1, "Edycja etap\xf3w"),
    //           r.Sb()),
    //         2 & t && r.hc("queryParams", r.jc(1, Ln, e.wyrob))
    //       },
    //       directives: [i.d],
    //       styles: [""]
    //     }),
    //     t
    // }

    this.columnDefs = [{
      headerName: "lp",
      field: "id",
      width: 90,
      valueGetter: t => +t.node!.id! + 1
    }, {
      headerName: "Wyr\xf3b",
      field: "wyrob",
      filter: "agSetColumnFilter",
      width: 400,
      cellRenderer: "agGroupCellRenderer"
    }, {
      headerName: "akcja",
      field: "id",
      width: 150,
      // cellRendererFramework: Gn,
      cellRenderer: (params: any) => `<a target="_blank" href="index/wyroby/struktura/podzial?wyrob=${params.data.wyrob}">edycja</a>`,
      sortable: !1
    }];
    let e = {
      animateRows: !0,
      defaultColDef: {
        sortable: !0,
        resizable: !0,
        floatingFilter: !0
      },
      rowSelection: "multiple",
      localeText: AG_GRID_LOCALE_PL,
      columnDefs: [{
        headerName: "Przewodnik",
        field: "numer_przewodnika",
        width: 110,
        cellRenderer: (t: any) => `<a target="_blank" href="../../mcp3/technologia/przewodniki?string=${t.value}&przycisk=Wybierz">${t.value}</a>`
      }, {
        headerName: "Kategoria",
        field: "kategoria",
        filter: "agSetColumnFilter",
        width: 100
      }, {
        headerName: "Ilo\u015b\u0107 dla wyrobu",
        field: "ilosc_szt",
        filter: "agNumberColumnFilter",
        cellRenderer: null,
        width: 135
      }, {
        headerName: "Ilo\u015b\u0107 w przewodniku",
        field: "przewodnik.szt_na_kpl",
        filter: "agNumberColumnFilter",
        cellRenderer: null,
        width: 142
      }, {
        headerName: "Numer rysunku",
        field: "przewodnik.numer_rysunku",
        filter: "agTextColumnFilter",
        cellRenderer: null,
        width: 180
      }, {
        headerName: "Nazwa rysunku",
        field: "przewodnik.nazwa_rysunku",
        filter: "agTextColumnFilter",
        cellRenderer: null,
        width: 180
      }, {
        headerName: "Numery rysunkow - wszystkie",
        field: "przewodnik.tekst_numery_rysunkow",
        filter: "agTextColumnFilter",
        cellRenderer: null,
        width: 180
      }, {
        headerName: "Nazwy rysunkow - wszystkie",
        field: "przewodnik.tekst_nazwy_rysunkow",
        filter: "agTextColumnFilter",
        cellRenderer: null,
        width: 180
      }, {
        headerName: "Materia\u0142 - przewodnik",
        field: "przewodnik.tekst_material",
        filter: "agTextColumnFilter",
        cellRenderer: null,
        width: 180
      }, {
        headerName: "Materia\u0142 masa",
        field: "przewodnik.masa_materialu",
        filter: "agNumberColumnFilter",
        cellRenderer: null,
        width: 130
      }, {
        headerName: "Element masa",
        field: "przewodnik.masa",
        filter: "agNumberColumnFilter",
        cellRenderer: null,
        width: 130
      }, {
        headerName: "Ilosc m2 lub mb ",
        field: "przewodnik.ilosc_metrow_materialu",
        filter: "agNumberColumnFilter",
        cellRenderer: null,
        width: 140
      }, {
        headerName: "Jednostka metr\xf3w",
        field: "przewodnik.jednostka_metrow_materialu",
        filter: "agTextColumnFilter",
        cellRenderer: null,
        width: 130
      }, {
        headerName: "Wchodzi do",
        field: "przewodnik.wchodzi_do",
        filter: "agTextColumnFilter",
        cellRenderer: null,
        width: 150
      }]
    };
    this.gridOptions = {
      masterDetail: !0,
      detailCellRendererParams: {
        detailGridOptions: e,
        getDetailRowData: (t: any) => {
          this.serwis.zapytaj_o("wyrob", {wyrob: t.data.wyrob})
            .subscribe({
              next: dane => {
                loading.set(false);
                t.successCallback(dane.przewodniki)

              },
              error: (e) => {
                loading.set(false);
                this.serwis.errorhandler(e);
              }
            })
        }
      },
        columnDefs: this.columnDefs,
        localeText: AG_GRID_LOCALE_PL,
        rowSelection: "multiple",
        enableRangeSelection: !0,
        defaultColDef: {
          sortable: !0,
          resizable: !0,
          floatingFilter: !0
        },
        onGridReady: (t: any) => {

          this.wczytaj_wyroby()
        },
        //onSelectionChanged: null,
        animateRows: !0,
        // onCellValueChanged: null,
        // getRowStyle: null

    }
  }

  wczytaj_wyroby() {

    loading.set(true);
   // this.grid.api.showLoadingOverlay();

    this.serwis.zapytaj_o("wyroby", {})
      .subscribe({
        next: t => {
          loading.set(false);
          this.grid.api.setGridOption("rowData", t);
        },
        error: t => {
          loading.set(false);
          this.serwis.errorhandler(t);
        }

      })
  }
}
