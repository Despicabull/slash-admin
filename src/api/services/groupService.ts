import type { Group } from "#/entity";
import apiClient from "../apiClient";

export interface CreateGroupReq {
	name: string;
	description?: string;
}

export interface UpdateGroupReq {
	name?: string;
	description?: string;
}

export enum DeviceApi {
	Groups = "/groups",
}

const createGroup = (data: CreateGroupReq) => apiClient.post<Group>({ url: DeviceApi.Groups, data });
const updateGroup = (id: string, data: UpdateGroupReq) =>
	apiClient.patch<Group>({ url: `${DeviceApi.Groups}/${id}`, data });
const deleteGroup = (id: string) => apiClient.delete({ url: `${DeviceApi.Groups}/${id}` });
const fetchGroups = () => apiClient.get<Group[]>({ url: DeviceApi.Groups });
const fetchByGroupId = (id: string) => apiClient.get<Group>({ url: `${DeviceApi.Groups}/${id}` });

export default {
	createGroup,
	updateGroup,
	deleteGroup,
	fetchGroups,
	fetchByGroupId,
};
