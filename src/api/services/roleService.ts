import type { Role } from "#/entity";
import apiClient from "../apiClient";

export enum RoleApi {
  Roles = "/roles",
}

const fetchRoles = () => apiClient.get<Role[]>({ url: RoleApi.Roles });
const fetchByRoleId = (id: string) => apiClient.get<Role>({ url: `${RoleApi.Roles}/${id}` });

export default {
  fetchRoles,
  fetchByRoleId,
};
