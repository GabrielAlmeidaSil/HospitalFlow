import { Component, OnInit } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { Sidebar } from '../../sidebar/sidebar/sidebar';

@Component({
  selector: 'app-header',
  imports: [MenuModule, ButtonModule, DrawerModule, Sidebar],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            { label: 'New', icon: 'pi pi-plus' },
            { label: 'Search', icon: 'pi pi-search' }
        ];
    }

    menuAberto: boolean = false;

    drawerPt = {
        content: { class: 'p-0' }
    };
}
