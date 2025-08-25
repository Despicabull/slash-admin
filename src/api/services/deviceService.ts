import type { DeviceInfo } from "#/entity";
import apiClient from "../apiClient";

export enum DeviceApi {
	Devices = "/devices",
}

const fetchDevices = () => apiClient.get<DeviceInfo[]>({ url: DeviceApi.Devices });

export default {
	fetchDevices,
};
