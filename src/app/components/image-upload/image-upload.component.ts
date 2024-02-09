import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ImageUploadComponent {
  imageUrl: string | ArrayBuffer | null = null;

  constructor() { }

  
}