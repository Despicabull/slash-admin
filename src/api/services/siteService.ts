import type { Site } from "#/entity";
import apiClient from "../apiClient";

export enum DeviceApi {
  Sites = "/sites",
}

const fetchSites = () => apiClient.get<Site[]>({ url: DeviceApi.Sites });
const fetchBySiteId = (id: string) => apiClient.get<Site>({ url: `${DeviceApi.Sites}/${id}` });

export default {
  fetchSites,
  fetchBySiteId,
};
