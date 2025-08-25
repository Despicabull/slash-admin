import type { RecordingInfo } from "#/entity";
import apiClient from "../apiClient";

export enum RecordingApi {
	Recordings = "/recordings",
	Recording = "/recording",
}

const fetchRecordings = (page: number, limit: number, devices?: string[], date?: string) =>
	apiClient.get<RecordingInfo[]>({ url: RecordingApi.Recordings, params: { page, limit, devices, date } });
const findByRecordingId = (id: string) => apiClient.get<RecordingInfo>({ url: `${RecordingApi.Recording}/${id}` });

export default {
	fetchRecordings,
	findByRecordingId,
};
