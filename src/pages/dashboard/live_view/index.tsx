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

	useEffect(() => {
		const getDevices = async () => {
			try {
				const data = await deviceService.fetchDevices();
				setDevices(data);
			} catch (error) {
				console.error("Failed to fetch devices", error);
			}
		};

		getDevices();
	}, []);

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
