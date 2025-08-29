import type { Site } from "#/entity";
import apiClient from "../apiClient";

export interface CreateSiteReq {
	name: string;
	address?: string;
	description?: string;
}

export interface UpdateSiteReq {
	name?: string;
	address?: string;
	description?: string;
}

export enum DeviceApi {
	Sites = "/sites",
}

const createSite = (data: CreateSiteReq) => apiClient.post<Site>({ url: DeviceApi.Sites, data });
const updateSite = (id: string, data: UpdateSiteReq) =>
	apiClient.patch<Site>({ url: `${DeviceApi.Sites}/${id}`, data });
const deleteSite = (id: string) => apiClient.delete({ url: `${DeviceApi.Sites}/${id}` });
const fetchSites = () => apiClient.get<Site[]>({ url: DeviceApi.Sites });
const fetchBySiteId = (id: string) => apiClient.get<Site>({ url: `${DeviceApi.Sites}/${id}` });

export default {
	createSite,
	updateSite,
	deleteSite,
	fetchSites,
	fetchBySiteId,
};
