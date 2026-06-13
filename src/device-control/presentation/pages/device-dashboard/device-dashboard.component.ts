import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DevicesOverviewStore, NewDeviceType } from '../../../application/devices-overview.store';
import { Room } from '../../../domain/model/room.entity';
import { SmartDevice } from '../../../domain/model/smart-device.entity';
import { GOOGLE_ICONS, GoogleIconKey } from '../../../../shared/constants/google-icons';
import { MATERIAL_IMPORTS } from '../../../../shared/material';

@Component({
  selector: 'app-device-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, ...MATERIAL_IMPORTS],
  templateUrl: './device-dashboard.component.html',
  styleUrls: ['./device-dashboard.component.css'],
})
export class DeviceDashboardComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  readonly store = inject(DevicesOverviewStore);
  readonly icons = GOOGLE_ICONS;

  readonly showAddModal = signal(false);
  newDeviceName = '';
  selectedRoomId = 'living-room';
  selectedDeviceType: NewDeviceType = 'generic';

  ngOnInit(): void {
    this.store.loadOverview().subscribe();
  }

  getIcon(iconKey: string): string {
    return GOOGLE_ICONS[iconKey as GoogleIconKey] ?? GOOGLE_ICONS.deviceHub;
  }

  getRoomIconClass(room: Room): string {
    return `room-icon room-icon--${room.id}`;
  }

  getConnectionLabel(device: SmartDevice): string {
    if (device.statusLabel) return device.statusLabel;
    if (device.connection === 'offline') return this.translate.instant('common.offline');
    return this.translate.instant('common.online');
  }

  getPowerLabel(device: SmartDevice): string {
    if (device.connection === 'offline' || device.powerUsageW === null) return '--';
    return `${device.powerUsageW}W`;
  }

  isToggleDisabled(device: SmartDevice): boolean {
    return device.connection === 'offline';
  }

  onToggle(roomId: string, device: SmartDevice): void {
    if (this.isToggleDisabled(device)) return;
    this.store.toggleDevice(roomId, device.id);
  }

  onScene(sceneId: string): void {
    this.store.activateScene(sceneId);
  }

  openDevice(roomId: string, deviceId: string): void {
    this.router.navigate(['/app/devices', roomId, deviceId]);
  }

  openAddModal(): void {
    this.newDeviceName = '';
    this.selectedRoomId = 'living-room';
    this.selectedDeviceType = 'generic';
    this.showAddModal.set(true);
  }

  closeAddModal(): void {
    this.showAddModal.set(false);
  }

  submitAddDevice(): void {
    if (!this.newDeviceName.trim()) return;

    this.store.addDevice(this.selectedRoomId, this.newDeviceName, this.selectedDeviceType).subscribe({
      next: detail => {
        this.closeAddModal();
        this.router.navigate(['/app/devices', this.selectedRoomId, detail.id]);
      },
    });
  }
}
