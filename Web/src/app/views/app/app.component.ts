import { Component } from '@angular/core';
import { AuthApiService } from 'src/app/shared/services/auth-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  public title: string = 'Web';

  constructor(public readonly authApiService: AuthApiService) {}
}
