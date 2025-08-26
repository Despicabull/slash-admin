import type { Recording } from "#/entity";
import apiClient from "../apiClient";

export enum RecordingApi {
	Recordings = "/recordings",
}

const fetchRecordings = (page: number, limit: number, devices?: string[], date?: string) =>
	apiClient.get<Recording[]>({ url: RecordingApi.Recordings, params: { page, limit, devices, date } });
const fetchByRecordingId = (id: string) => apiClient.get<Recording>({ url: `${RecordingApi.Recordings}/${id}` });

export default {
	fetchRecordings,
	fetchByRecordingId,
};
