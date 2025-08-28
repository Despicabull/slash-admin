import type { Permission } from "#/entity";
import apiClient from "../apiClient";

export enum PermissionApi {
  Permissions = "/devices",
}

const fetchPermissions = () => apiClient.get<Permission[]>({ url: PermissionApi.Permissions });

export default {
	fetchPermissions,
};
