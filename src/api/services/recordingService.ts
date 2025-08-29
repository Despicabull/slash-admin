import type { Recording } from "#/entity";
import apiClient from "../apiClient";

export enum RecordingApi {
	Recordings = "/recordings",
}

const fetchRecordings = (page: number, limit: number, devices?: string[], date?: string) =>
	apiClient.get<Recording[]>({ url: RecordingApi.Recordings, params: { page, limit, devices, date } });
const fetchRecordingsCount = () => apiClient.get<number>({ url: `${RecordingApi.Recordings}/count` });
const fetchByRecordingId = (id: string) => apiClient.get<Recording>({ url: `${RecordingApi.Recordings}/${id}` });

export default {
	fetchRecordings,
	fetchRecordingsCount,
	fetchByRecordingId,
};
