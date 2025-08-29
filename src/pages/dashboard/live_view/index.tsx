import { useEffect, useState } from "react";
import deviceService from "@/api/services/deviceService";
import type { Device } from "@/types/entity";
import { Card } from "@/ui/card";
import { Text } from "@/ui/typography";
import { getDeviceStatus } from "@/utils/device";
import WebRTCStream from "./camera-feed";

function isDeviceOnline(device: Device): boolean {
	return getDeviceStatus(device.lastHeartbeat) === "online";
}

export default function LiveViewPage() {
	const [devices, setDevices] = useState<Device[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedDevices, setSelectedDevices] = useState<Set<string>>(new Set());
	const [hubKey] = useState<string>("your-hub-key"); // Replace with actual hub key

	useEffect(() => {
		const getDevices = async () => {
			try {
				setLoading(true);
				const data = await deviceService.fetchDevices();
				setDevices(data);
				setError(null);
			} catch (err) {
				console.error("Failed to fetch devices", err);
				setError("Failed to load devices");
			} finally {
				setLoading(false);
			}
		};

		getDevices();
	}, []);

	const handleDeviceToggle = (deviceKey: string) => {
		setSelectedDevices((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(deviceKey)) {
				newSet.delete(deviceKey);
			} else {
				newSet.add(deviceKey);
			}
			return newSet;
		});
	};

	const handleStreamError = (deviceKey: string, errorMessage: string) => {
		console.error(`Stream error for device ${deviceKey}:`, errorMessage);
		// Optionally show user notification
	};

	if (loading) {
		return <div className="p-6">Loading devices...</div>;
	}

	if (error) {
		return <div className="p-6 text-red-500">{error}</div>;
	}

	const onlineDevices = devices.filter(isDeviceOnline);

	return (
		<div className="flex flex-col gap-4 w-full">
			{/* Header Card */}
			<Card className="flex flex-col p-6">
				<div className="flex flex-col gap-4 mb-4">
					<div className="flex items-center justify-between">
						<Text variant="body2" className="font-semibold text-lg">
							Live Camera Feeds
						</Text>
						<div className="flex items-center gap-2">
							<Text variant="body2" className="text-gray-500">
								{selectedDevices.size} active stream{selectedDevices.size !== 1 ? "s" : ""}
							</Text>
						</div>
					</div>
				</div>

				<div className="mb-4">
					<Text variant="body2" className="text-gray-500">
						Showing {onlineDevices.length} online device{onlineDevices.length !== 1 ? "s" : ""}
					</Text>
				</div>

				{/* Device Selection */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
					{onlineDevices.map((device) => (
						<button
							key={device.key}
							type="button"
							className={`border rounded-lg p-4 cursor-pointer transition-colors text-left ${
								selectedDevices.has(device.key) ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
							}`}
							onClick={() => handleDeviceToggle(device.key)}
						>
							<div className="flex items-center justify-between">
								<div>
									<Text variant="body2" className="font-medium">
										{device.name}
									</Text>
									<Text variant="caption" className="text-gray-500">
										{device.key}
									</Text>
								</div>
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 bg-green-500 rounded-full" />
									<Text variant="caption" className="text-green-600">
										Online
									</Text>
								</div>
							</div>
						</button>
					))}
				</div>
			</Card>

			{/* Live Streams */}
			{selectedDevices.size > 0 && (
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
					{Array.from(selectedDevices).map((deviceKey) => {
						const device = onlineDevices.find((d) => d.key === deviceKey);
						if (!device) return null;

						return (
							<Card key={deviceKey} className="p-4">
								<div className="flex items-center justify-between mb-4">
									<div>
										<Text variant="body2" className="font-medium">
											{device.name}
										</Text>
										<Text variant="caption" className="text-gray-500">
											WebRTC Live Stream
										</Text>
									</div>
									<button
										type="button"
										onClick={() => handleDeviceToggle(deviceKey)}
										className="text-gray-400 hover:text-gray-600"
										title="Close stream"
									>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
											<title>Close</title>
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								</div>

								<WebRTCStream
									device={device}
									hubKey={hubKey}
									onError={(error) => handleStreamError(deviceKey, error)}
								/>
							</Card>
						);
					})}
				</div>
			)}

			{/* No Streams Message */}
			{selectedDevices.size === 0 && onlineDevices.length > 0 && (
				<Card className="p-8 text-center">
					<Text variant="body2" className="text-gray-500 mb-2">
						No live streams active
					</Text>
					<Text variant="caption" className="text-gray-400">
						Click on a device above to start viewing its live feed
					</Text>
				</Card>
			)}

			{/* No Devices Message */}
			{onlineDevices.length === 0 && (
				<Card className="p-8 text-center">
					<Text variant="body2" className="text-gray-500 mb-2">
						No online devices available
					</Text>
					<Text variant="caption" className="text-gray-400">
						Make sure your devices are connected and sending heartbeats
					</Text>
				</Card>
			)}
		</div>
	);
}
