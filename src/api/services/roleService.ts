import type { Role } from "#/entity";
import apiClient from "../apiClient";

export enum DeviceApi {
  Roles = "/roles",
}

const fetchRoles = () => apiClient.get<Role[]>({ url: DeviceApi.Roles });
const fetchByRoleId = (id: string) => apiClient.get<Role>({ url: `${DeviceApi.Roles}/${id}` });

export default {
  fetchRoles,
  fetchByRoleId,
};
