import type { Permission, Role } from "#/entity";
import apiClient from "../apiClient";

export interface CreateRoleReq {
	name: string;
	description?: string;
	permissions?: Permission[];
}

export interface UpdateRoleReq {
	name?: string;
	description?: string;
	permissions?: Permission[];
}

export enum RoleApi {
	Roles = "/roles",
}

const createRole = (data: CreateRoleReq) => apiClient.post<Role>({ url: RoleApi.Roles, data });
const updateRole = (id: string, data: UpdateRoleReq) => apiClient.patch<Role>({ url: `${RoleApi.Roles}/${id}`, data });
const deleteRole = (id: string) => apiClient.delete({ url: `${RoleApi.Roles}/${id}` });
const fetchRoles = () => apiClient.get<Role[]>({ url: RoleApi.Roles });
const fetchByRoleId = (id: string) => apiClient.get<Role>({ url: `${RoleApi.Roles}/${id}` });

export default {
	createRole,
	updateRole,
	deleteRole,
	fetchRoles,
	fetchByRoleId,
};
