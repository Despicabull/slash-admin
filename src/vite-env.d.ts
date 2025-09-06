/// <reference types="vite/client" />

interface ImportMetaEnv {
	/** Default route path for the application */
	readonly VITE_APP_DEFAULT_ROUTE: string;
	/** Public path for static assets */
	readonly VITE_APP_PUBLIC_PATH: string;
	/** Base URL for API endpoints */
	readonly VITE_APP_API_BASE_URL: string;
	/** Routing mode: frontend routing or backend routing */
	readonly VITE_APP_ROUTER_MODE: "frontend" | "backend";
	/** WebRTC ICE servers (JSON string) */
	readonly VITE_APP_WEBRTC_ICE_SERVERS?: string;
	/** WebRTC ICE candidate pool size */
	readonly VITE_APP_WEBRTC_ICE_CANDIDATE_POOL_SIZE?: string;
	/** WebRTC bundle policy */
	readonly VITE_APP_WEBRTC_BUNDLE_POLICY?: string;
	/** WebRTC RTCP mux policy */
	readonly VITE_APP_WEBRTC_RTCP_MUX_POLICY?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
