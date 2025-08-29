import type { Device } from "#/entity";
import apiClient from "../apiClient";

export enum DeviceApi {
	Devices = "/devices",
}

const fetchDevices = () => apiClient.get<Device[]>({ url: DeviceApi.Devices });
const fetchDevicesCount = () => apiClient.get<number>({ url: `${DeviceApi.Devices}/count` });
const fetchByDeviceId = (id: string) => apiClient.get<Device>({ url: `${DeviceApi.Devices}/${id}` });

export default {
	fetchDevices,
	fetchDevicesCount,
	fetchByDeviceId,
};
