import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-service',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-service.html',
  styleUrls: ['./card-service.scss']
})
export class CardService {
  protected router = inject(Router);
  private _props: Partial<{
    id: number;
    nombre_Servicio: string;
    mini_descripcion: string;
    Logo: string;
  }> = {};

  @Input()
  set props(v: Partial<{ id: number; nombre_Servicio: string; mini_descripcion: string; Logo: string; }>) {
    this._props = v ?? {};
    this.id = this._props.id ?? 0;
    this.nombre_Servicio = this._props.nombre_Servicio ?? '';
    this.mini_descripcion = this._props.mini_descripcion ?? '';
    this.Logo = this._props.Logo ?? '';
  }
  get props() { return this._props; }
  id = 0;
  nombre_Servicio = '';
  mini_descripcion = '';
  Logo = '';

  // helper: detectar si Logo es una URL de imagen
  isUrl(v?: string) {
    if (!v) return false;
    return /^https?:\/\//.test(v) || /\.(png|jpe?g|webp|svg|avif)$/.test(v);
  }

  more() {
    this.router.navigate(['/more'])
  }
  onView(id?: number) {
    
    this.router.navigate(['/service'], { queryParams: { id } });
  }
}
