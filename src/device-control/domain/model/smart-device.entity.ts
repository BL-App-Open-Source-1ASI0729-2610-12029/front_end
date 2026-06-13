export type SmartDeviceConnection = 'online' | 'offline';

export interface SmartDevice {
  id: string;
  name: string;
  icon: string;
  connection: SmartDeviceConnection;
  active: boolean;
  powerUsageW: number | null;
  statusLabel?: string;
}
