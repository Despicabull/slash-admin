import apiClient from "../apiClient";

export interface WebRTCMessagePayload {
	action: string;
	deviceId: string;
	value: {
		sdp?: string;
		candidate?: string;
		session_id: string;
	};
}

export interface WebRTCMessageReq {
	topic: string;
	message: {
		payload: WebRTCMessagePayload;
	};
}

export interface WebRTCMessageRes {
	success: boolean;
	messageId?: string;
	error?: string;
}

export enum WebRTCApi {
	Message = "/webrtc/message",
}

const sendMessage = (data: WebRTCMessageReq) => apiClient.post<WebRTCMessageRes>({ url: WebRTCApi.Message, data });

export default {
	sendMessage,
};
