import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class ZapiszZapytajService {

  constructor(private http: HttpClient, private toastr: ToastrService) {

  }
  zapytaj_o(co: string , dla: any): Observable<any> {
    return this.http.post(`http://local.mcp:8888/apps/xhr/przeglady/zapytaj_o/${co}`, {
      dla: dla
    })
  }
  zapisz(co: string , dla: any): Observable<any> {
    return this.http.post(`http://local.mcp:8888/apps/xhr/przeglady/zapisz/${co}`, {
      payload: dla
    })
  }
  errorhandler(d: any) {
    let byl_juz_komunikat = false;
    if (d.error.errors) {
      console.error(d);
      if (typeof d.error.errors === 'string') {
        //this.message.add({summary: d.error.errors, severity: 'error', icon: 'pi pi-times'});
        this.toastr.error(d.error.errors);
        if (d.error.message) {
          this.toastr.error(d.error.message);
          //this.message.add({summary: d.error.message, severity: 'error', icon: 'pi pi-times'});
          if (d.error.message.toLowerCase().includes('unauthenticated')) {
            document.location.replace('../../logout?akcja=logout&target=' + location.pathname.substring(1));
          }
        }
        return;
      }
      for (let key in d.error.errors) {
        if (d.error.errors.hasOwnProperty(key)) {
          d.error.errors[key].forEach((wiadomosc: string) => {
            this.toastr.error(wiadomosc);
            // this.message.add({summary: d.error.message, severity: 'error', icon: 'pi pi-times'});
            byl_juz_komunikat = true;
          });
        }
      }
      if (!byl_juz_komunikat) {
        this.toastr.error(d.error.message);
        // this.message.add({summary: d.error.message, severity: 'error', icon: 'pi pi-times'});
      }
    }
    if (!byl_juz_komunikat) {
      this.toastr.error('Bład ' + d.message);
      // this.message.add({summary: d.error.message, severity: 'error', icon: 'pi pi-times'});
    }
  }
}
