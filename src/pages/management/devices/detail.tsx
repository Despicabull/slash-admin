import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import deviceService from "@/api/services/deviceService";
import type { Device } from "@/types/entity";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Text } from "@/ui/typography";
import { getDeviceStatus } from "@/utils/device";

export default function DeviceDetailPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("details");
	const [device, setDevice] = useState<Device | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) return;

		const getDevice = async () => {
			try {
				setLoading(true);
				const data = await deviceService.fetchByDeviceId(id);
				setDevice(data || null);
				setError(null);
			} catch (err) {
				console.error("Failed to fetch device", err);
				setError("Failed to load device details");
			} finally {
				setLoading(false);
			}
		};

		getDevice();
	}, [id]);

	if (loading) {
		return <div className="p-6">Loading device details...</div>;
	}

	if (error) {
		return <div className="p-6 text-red-500">{error}</div>;
	}

	if (!device) {
		return <div className="p-6">Device not found</div>;
	}

	const status = getDeviceStatus(device.lastHeartbeat);

	return (
		<div className="flex flex-col gap-4 w-full">
			<Button variant="outline" onClick={() => navigate(-1)} className="w-fit">
				← Back to Devices
			</Button>

			<Card className="p-6">
				<div className="flex items-center justify-between mb-6">
					<Text variant="body2" className="font-semibold">
						{device.name}
					</Text>
					<span
						className={`text-xs font-bold px-2 py-1 rounded ${
							status === "online" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
						}`}
					>
						{status}
					</span>
				</div>

				<div className="flex gap-2 mb-6">
					{["details", "configuration"].map((tab) => (
						<Button
							key={tab}
							variant={activeTab === tab ? "default" : "ghost"}
							onClick={() => setActiveTab(tab)}
							className="capitalize"
						>
							{tab}
						</Button>
					))}
				</div>

				{activeTab === "details" && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-4">
							<div>
								<Text variant="body2" className="text-gray-500">
									ID
								</Text>
								<Text variant="body1" className="font-medium">
									{device.id}
								</Text>
							</div>

							<div>
								<Text variant="body2" className="text-gray-500">
									Name
								</Text>
								<Text variant="body1" className="font-medium">
									{device.name}
								</Text>
							</div>

							<div>
								<Text variant="body2" className="text-gray-500">
									Version
								</Text>
								<Text variant="body1" className="font-medium">
									{device.version || "N/A"}
								</Text>
							</div>

							<div>
								<Text variant="body2" className="text-gray-500">
									Hostname
								</Text>
								<Text variant="body1" className="font-medium">
									{device.hostname || "N/A"}
								</Text>
							</div>

							<div>
								<Text variant="body2" className="text-gray-500">
									MAC Addresses
								</Text>
								<Text variant="body1" className="font-medium">
									{device.macs?.length ? device.macs.join(", ") : "N/A"}
								</Text>
							</div>
						</div>

						<div className="space-y-4">
							<div>
								<Text variant="body2" className="text-gray-500">
									IP Addresses
								</Text>
								<Text variant="body1" className="font-medium">
									{device.ips?.length ? device.ips.join(", ") : "N/A"}
								</Text>
							</div>

							<div>
								<Text variant="body2" className="text-gray-500">
									Uptime
								</Text>
								<Text variant="body1" className="font-medium">
									{device.uptime || "N/A"}
								</Text>
							</div>

							<div>
								<Text variant="body2" className="text-gray-500">
									Total Memory
								</Text>
								<Text variant="body1" className="font-medium">
									{device.totalMemory || "N/A"}
								</Text>
							</div>

							<div>
								<Text variant="body2" className="text-gray-500">
									Used Memory
								</Text>
								<Text variant="body1" className="font-medium">
									{device.usedMemory || "N/A"}
								</Text>
							</div>

							<div>
								<Text variant="body2" className="text-gray-500">
									ONVIF
								</Text>
								<Text variant="body1" className="font-medium">
									{device.onvif ? "Yes" : "No"}
								</Text>
							</div>

							<div>
								<Text variant="body2" className="text-gray-500">
									Last Heartbeat
								</Text>
								<Text variant="body1" className="font-medium">
									{device.lastHeartbeat ? new Date(device.lastHeartbeat).toLocaleString() : "No heartbeat"}
								</Text>
							</div>
						</div>
					</div>
				)}

				{activeTab === "configuration" && (
					<div className="py-4">
						<Text variant="body1">Configuration details would be displayed here.</Text>
					</div>
				)}
			</Card>
		</div>
	);
}
