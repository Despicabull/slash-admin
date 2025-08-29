import { useCallback, useEffect, useRef, useState } from "react";
import webrtcService from "@/api/services/webrtcService";
import { GLOBAL_CONFIG } from "@/global-config";
import type { Device } from "@/types/entity";

interface WebRTCStreamProps {
	device: Device;
	hubKey: string;
	onError?: (error: string) => void;
}

interface WebRTCMessage {
	payload: {
		action: string;
		deviceId: string;
		value: {
			sdp?: string;
			candidate?: string;
			session_id: string;
		};
	};
}

export default function WebRTCStream({ device, hubKey, onError }: WebRTCStreamProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
	const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>("new");
	const [isConnecting, setIsConnecting] = useState(false);
	const sessionIdRef = useRef<string>("");

	const rtcConfig: RTCConfiguration = GLOBAL_CONFIG.webrtc;

	const generateSessionId = useCallback((): string => {
		return Math.random().toString(36).substring(2) + Date.now().toString(36);
	}, []);

	const sendMqttMessage = useCallback(async (topic: string, message: WebRTCMessage) => {
		try {
			const response = await webrtcService.sendMessage({
				topic,
				message,
			});

			if (!response.success) {
				throw new Error(response.error || "Failed to send WebRTC message");
			}

			return response;
		} catch (error) {
			console.error("MQTT message send failed:", error);
			throw error;
		}
	}, []);

	const sendIceCandidate = useCallback(
		async (candidate: RTCIceCandidate) => {
			try {
				const message: WebRTCMessage = {
					payload: {
						action: "receive-hd-candidates",
						deviceId: device.key,
						value: {
							candidate: JSON.stringify(candidate.toJSON()),
							session_id: sessionIdRef.current,
						},
					},
				};

				// Send via your MQTT client or API endpoint
				// This should match your Go backend's expected format
				await sendMqttMessage(`kerberos/hub/${hubKey}/${device.key}`, message);
			} catch (error) {
				console.error("Failed to send ICE candidate:", error);
				onError?.("Failed to send ICE candidate");
			}
		},
		[device.key, hubKey, onError, sendMqttMessage],
	);

	const setupMessageListener = useCallback(() => {
		// Implement WebSocket or Server-Sent Events to listen for messages from Go backend
		// This is a simplified example - you'll need to implement based on your architecture

		// Example using WebSocket:
		const ws = new WebSocket(`ws://your-backend/webrtc/${device.key}`);

		ws.onmessage = async (event) => {
			try {
				const data = JSON.parse(event.data);

				if (data.payload.action === "receive-hd-answer") {
					// Handle SDP answer
					const answerSdp = atob(data.payload.value.sdp);
					const answer: RTCSessionDescriptionInit = {
						type: "answer",
						sdp: answerSdp,
					};

					await peerConnectionRef.current?.setRemoteDescription(answer);
					setIsConnecting(false);
				} else if (data.payload.action === "receive-hd-candidates") {
					// Handle ICE candidates
					const candidateData = JSON.parse(data.payload.value.candidate);
					const candidate = new RTCIceCandidate(candidateData);
					await peerConnectionRef.current?.addIceCandidate(candidate);
				}
			} catch (error) {
				console.error("Failed to handle WebRTC message:", error);
				onError?.("Failed to process WebRTC message");
			}
		};

		ws.onerror = (error) => {
			console.error("WebSocket error:", error);
			onError?.("WebSocket connection failed");
			setIsConnecting(false);
		};

		return () => {
			ws.close();
		};
	}, [device.key, onError]);

	const createPeerConnection = useCallback(() => {
		const pc = new RTCPeerConnection(rtcConfig);

		pc.onconnectionstatechange = () => {
			setConnectionState(pc.connectionState);
			console.log("WebRTC connection state:", pc.connectionState);
		};

		pc.onicecandidate = (event) => {
			if (event.candidate) {
				// Send ICE candidate to the Go backend via MQTT or API
				sendIceCandidate(event.candidate);
			}
		};

		pc.ontrack = (event) => {
			console.log("Received remote stream");
			if (videoRef.current && event.streams[0]) {
				videoRef.current.srcObject = event.streams[0];
			}
		};

		return pc;
	}, [sendIceCandidate, rtcConfig]);

	const startWebRTCConnection = useCallback(async () => {
		if (isConnecting || peerConnectionRef.current) return;

		try {
			setIsConnecting(true);
			sessionIdRef.current = generateSessionId();

			const pc = createPeerConnection();
			peerConnectionRef.current = pc;

			// Create offer
			const offer = await pc.createOffer({
				offerToReceiveVideo: true,
				offerToReceiveAudio: true,
			});

			await pc.setLocalDescription(offer);

			// Send offer to Go backend
			const message: WebRTCMessage = {
				payload: {
					action: "request-hd-stream",
					deviceId: device.key,
					value: {
						sdp: btoa(offer.sdp || ""),
						session_id: sessionIdRef.current,
					},
				},
			};

			await sendMqttMessage(`kerberos/hub/${hubKey}/${device.key}`, message);

			// Set up message listener for SDP answer and ICE candidates
			setupMessageListener();
		} catch (error) {
			console.error("Failed to start WebRTC connection:", error);
			onError?.("Failed to establish WebRTC connection");
			setIsConnecting(false);
		}
	}, [
		isConnecting,
		device.key,
		hubKey,
		createPeerConnection,
		generateSessionId,
		sendMqttMessage,
		onError,
		setupMessageListener,
	]);

	const stopStream = useCallback(() => {
		if (peerConnectionRef.current) {
			peerConnectionRef.current.close();
			peerConnectionRef.current = null;
		}
		if (videoRef.current) {
			videoRef.current.srcObject = null;
		}
		setConnectionState("new");
		setIsConnecting(false);
	}, []);

	useEffect(() => {
		return () => {
			stopStream();
		};
	}, [stopStream]);

	const getConnectionStatusColor = (state: RTCPeerConnectionState): string => {
		switch (state) {
			case "connected":
				return "text-green-500";
			case "connecting":
				return "text-yellow-500";
			case "disconnected":
			case "failed":
				return "text-red-500";
			default:
				return "text-gray-500";
		}
	};

	return (
		<div className="relative w-full">
			{/* Video Element */}
			<video
				ref={videoRef}
				className="w-full h-auto bg-black rounded-lg"
				autoPlay
				playsInline
				muted
				controls={false}
				style={{ aspectRatio: "16/9" }}
			/>

			{/* Overlay Controls */}
			<div className="absolute top-2 left-2 flex items-center gap-2">
				<div className={`w-2 h-2 rounded-full ${getConnectionStatusColor(connectionState)}`} />
				<span className="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
					{connectionState.charAt(0).toUpperCase() + connectionState.slice(1)}
				</span>
			</div>

			{/* Control Buttons */}
			<div className="absolute bottom-2 right-2 flex gap-2">
				{!peerConnectionRef.current ? (
					<button
						type="button"
						onClick={startWebRTCConnection}
						disabled={isConnecting}
						className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm"
					>
						{isConnecting ? "Connecting..." : "Start Stream"}
					</button>
				) : (
					<button
						type="button"
						onClick={stopStream}
						className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
					>
						Stop Stream
					</button>
				)}
			</div>

			{/* Loading Overlay */}
			{isConnecting && (
				<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
					<div className="text-white text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2" />
						<p>Establishing connection...</p>
					</div>
				</div>
			)}
		</div>
	);
}
