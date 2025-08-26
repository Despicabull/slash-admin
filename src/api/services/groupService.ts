import type { Group } from "#/entity";
import apiClient from "../apiClient";

export enum DeviceApi {
  Groups = "/groups",
}

const fetchGroups = () => apiClient.get<Group[]>({ url: DeviceApi.Groups });
const fetchByGroupId = (id: string) => apiClient.get<Group>({ url: `${DeviceApi.Groups}/${id}` });

export default {
  fetchGroups,
  fetchByGroupId,
};
