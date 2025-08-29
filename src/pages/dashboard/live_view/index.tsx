import { useEffect, useState } from "react";
import deviceService from "@/api/services/deviceService";
import type { Device } from "@/types/entity";
import { Card } from "@/ui/card";
import { Text } from "@/ui/typography";
import { getDeviceStatus } from "@/utils/device";

function isDeviceOnline(device: Device): boolean {
	return getDeviceStatus(device.lastHeartbeat) === "online";
}

export default function LiveViewPage() {
	const [devices, setDevices] = useState<Device[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

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

	if (loading) {
		return <div className="p-6">Loading devices...</div>;
	}

	if (error) {
		return <div className="p-6 text-red-500">{error}</div>;
	}

	const onlineDevices = devices.filter(isDeviceOnline);

	return (
		<div className="flex flex-col gap-4 w-full">
			<Card className="flex flex-col p-6">
				<div className="flex flex-col gap-4 mb-4">
					<div className="flex items-center justify-between">
						<Text variant="body2" className="font-semibold text-lg">
							Live Camera Feeds
						</Text>
					</div>
				</div>

				<div className="mb-4">
					<Text variant="body2" className="text-gray-500">
						Showing {onlineDevices.length} live camera feed{onlineDevices.length !== 1 ? "s" : ""}
					</Text>
				</div>
			</Card>
		</div>
	);
}
