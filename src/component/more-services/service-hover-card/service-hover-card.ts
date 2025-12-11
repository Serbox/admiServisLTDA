import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-hover-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-hover-card.html',
  styleUrls: ['./service-hover-card.scss']
})
export class ServiceHoverCard {
  protected router = inject(Router);

  @Input() id: number =0;
  @Input() title = '';
  @Input() description?: string;
  @Input() image?: string;
  @Input() badge?: string;

  get isUrlImage(): boolean {
    const img = this.image ?? '';
    return !!img && (/^https?:\/\//.test(img) || /\.(png|jpe?g|webp|avif|svg)$/.test(img));
  }

  onView(id:number) { 
    this.router.navigate(['/service'], { queryParams: { id } });
   }
}
