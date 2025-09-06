import packageJson from "../package.json";

interface WebRTCConfig {
	iceServers: RTCIceServer[];
	iceCandidatePoolSize: number;
	bundlePolicy?: RTCBundlePolicy;
	rtcpMuxPolicy?: RTCRtcpMuxPolicy;
}

// Helper function to parse ICE servers from environment variable
const parseIceServers = (envValue?: string): RTCIceServer[] => {
	if (!envValue) {
		return [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }];
	}

	try {
		return JSON.parse(envValue);
	} catch {
		console.warn("Invalid VITE_APP_WEBRTC_ICE_SERVERS format, using defaults");
		return [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }];
	}
};

/**
 * Global application configuration type definition
 */
export type GlobalConfig = {
	/** Application name */
	appName: string;
	/** Application version number */
	appVersion: string;
	/** Default route path for the application */
	defaultRoute: string;
	/** Public path for static assets */
	publicPath: string;
	/** Base URL for API endpoints */
	apiBaseUrl: string;
	/** Routing mode: frontend routing or backend routing */
	routerMode: "frontend" | "backend";
	/** WebRTC config */
	webrtc: WebRTCConfig;
};

/**
 * Global configuration constants
 * Reads configuration from environment variables and package.json
 *
 * @warning
 * Please don't use the import.meta.env to get the configuration, use the GLOBAL_CONFIG instead
 */
export const GLOBAL_CONFIG: GlobalConfig = {
	appName: "BVision Hub",
	appVersion: packageJson.version,
	defaultRoute: import.meta.env.VITE_APP_DEFAULT_ROUTE || "/dashboard",
	publicPath: import.meta.env.VITE_APP_PUBLIC_PATH || "/",
	apiBaseUrl: import.meta.env.VITE_APP_API_BASE_URL || "/api",
	routerMode: import.meta.env.VITE_APP_ROUTER_MODE || "frontend",
	webrtc: {
		iceServers: parseIceServers(import.meta.env.VITE_APP_WEBRTC_ICE_SERVERS),
		iceCandidatePoolSize: parseInt(import.meta.env.VITE_APP_WEBRTC_ICE_CANDIDATE_POOL_SIZE || "10"),
		bundlePolicy: (import.meta.env.VITE_APP_WEBRTC_BUNDLE_POLICY as RTCBundlePolicy) || "max-bundle",
		rtcpMuxPolicy: (import.meta.env.VITE_APP_WEBRTC_RTCP_MUX_POLICY as RTCRtcpMuxPolicy) || "require",
	},
};
