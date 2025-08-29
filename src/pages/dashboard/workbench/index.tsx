import { useEffect, useState } from "react";
import deviceService from "@/api/services/deviceService";
import recordingService from "@/api/services/recordingService";
import { Chart, useChart } from "@/components/chart";
import Icon from "@/components/icon/icon";
import type { Device } from "@/types/entity";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { Text, Title } from "@/ui/typography";
import { getDeviceStatus } from "@/utils/device";
import { rgbAlpha } from "@/utils/theme";

export default function WorkbenchPage() {
	const [activeTab, setActiveTab] = useState("All Devices");
	const [devices, setDevices] = useState<Device[]>([]);
	const [devicesLoading, setDevicesLoading] = useState(true);
	const [devicesError, setDevicesError] = useState<string | null>(null);
	const [recordingCount, setRecordingCount] = useState<number>(0);
	const [recordingCountLoading, setRecordingCountLoading] = useState(true);
	const [recordingCountError, setRecordingCountError] = useState<string | null>(null);

	// Move useChart to top level - create chart options for each stat type
	const deviceChartOptions = useChart({
		chart: { sparkline: { enabled: true } },
		colors: ["#3b82f6"],
		grid: { show: false },
		yaxis: { show: false },
		tooltip: { enabled: false },
	});

	const recordingsChartOptions = useChart({
		chart: { sparkline: { enabled: true } },
		colors: ["#10b981"],
		grid: { show: false },
		yaxis: { show: false },
		tooltip: { enabled: false },
	});

	useEffect(() => {
		const getDevices = async () => {
			try {
				setDevicesLoading(true);
				const data = await deviceService.fetchDevices();
				setDevices(data);
				setDevicesError(null);
			} catch (err) {
				console.error("Failed to fetch devices", err);
				setDevicesError("Failed to load devices");
			} finally {
				setDevicesLoading(false);
			}
		};

		getDevices();
	}, []);

	useEffect(() => {
		const getRecordingCount = async () => {
			try {
				setRecordingCountLoading(true);
				const data = await recordingService.fetchRecordingsCount();
				setRecordingCount(data);
				setRecordingCountError(null);
			} catch (err) {
				console.error("Failed to fetch devices", err);
				setRecordingCountError("Failed to load devices");
			} finally {
				setRecordingCountLoading(false);
			}
		};

		getRecordingCount();
	}, []);

	if (devicesLoading) {
		return <div className="p-6">Loading devices...</div>;
	}

	if (devicesError) {
		return <div className="p-6 text-red-500">{devicesError}</div>;
	}

	if (recordingCountLoading) {
		return <div className="p-6">Loading recording count...</div>;
	}

	if (recordingCountError) {
		return <div className="p-6 text-red-500">{recordingCountError}</div>;
	}

	// Enrich devices with status
	const enrichedDevices = devices.map((d) => ({
		...d,
		status: getDeviceStatus(d.lastHeartbeat),
	}));

	// Quick stats values
	const onlineCount = enrichedDevices.filter((d) => d.status === "online").length;
	const totalDevices = enrichedDevices.length;

	// Quick stats (only devices x/y and total recordings)
	const quickStats = [
		{
			icon: "mdi:devices",
			label: "Devices",
			value: `${onlineCount} / ${totalDevices}`,
			color: "#3b82f6",
			chartOptions: deviceChartOptions,
			chartData: [],
		},
		{
			icon: "mdi:filmstrip",
			label: "Recordings",
			value: recordingCount,
			color: "#10b981",
			chartOptions: recordingsChartOptions,
			chartData: [],
		},
	];

	// Filter based on tab
	const filteredDevices = enrichedDevices.filter((d) => {
		if (activeTab === "All Devices") return true;
		if (activeTab === "Online") return d.status === "online";
		if (activeTab === "Offline") return d.status === "offline";
		return true;
	});

	return (
		<div className="flex flex-col gap-4 w-full">
			{/* Quick Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{quickStats.map((stat) => (
					<Card key={stat.label} className="flex flex-col justify-between h-full">
						<CardContent className="flex flex-col gap-2 p-4">
							<div className="flex items-center gap-2">
								<div className="rounded-lg p-2" style={{ background: rgbAlpha(stat.color, 0.1) }}>
									<Icon icon={stat.icon} size={24} color={stat.color} />
								</div>
								<Text variant="body2" className="font-semibold">
									{stat.label}
								</Text>
							</div>
							<div className="flex items-center gap-2 mt-2">
								<Title as="h3" className="text-2xl font-bold">
									{stat.value}
								</Title>
							</div>
							<div className="w-full h-10 mt-2">
								<Chart type="bar" height={40} options={stat.chartOptions} series={[{ data: stat.chartData }]} />
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Devices Table */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<Card className="lg:col-span-2 flex flex-col p-6">
					<div className="flex items-center gap-4 mb-4">
						<Text variant="body2" className="font-semibold">
							Devices
						</Text>
						<div className="flex gap-2">
							{["All Devices", "Online", "Offline"].map((tab) => (
								<Button
									key={tab}
									size="sm"
									variant={activeTab === tab ? "default" : "ghost"}
									onClick={() => setActiveTab(tab)}
								>
									{tab}
								</Button>
							))}
						</div>
					</div>
					<div className="flex-1 overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="text-left border-b">
									<th className="py-2">Device</th>
									<th className="py-2 text-right">Last Heartbeat</th>
									<th className="py-2 text-right">Uptime</th>
									<th className="py-2 text-right">Status</th>
								</tr>
							</thead>
							<tbody>
								{filteredDevices.map((d) => (
									<tr key={d.name} className="border-b last:border-0">
										<td className="py-2 font-semibold">{d.name}</td>
										<td className="py-2 text-right">
											{d.lastHeartbeat ? new Date(d.lastHeartbeat).toLocaleString() : "No heartbeat"}
										</td>
										<td className="py-2 text-right">{d.uptime}</td>
										<td className="py-2 text-right">
											<span
												className={`text-xs font-bold inline-flex items-center gap-1 ${
													d.status === "online" ? "text-green-500" : "text-red-500"
												}`}
											>
												{d.status}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</Card>
			</div>
		</div>
	);
}
