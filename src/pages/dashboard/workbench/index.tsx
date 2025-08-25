import { Chart, useChart } from "@/components/chart";
import Icon from "@/components/icon/icon";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { Text, Title } from "@/ui/typography";
import { rgbAlpha } from "@/utils/theme";
import { useState } from "react";

const quickStats = [
	{
		icon: "solar:camera-outline",
		label: "Devices Online",
		value: "39",
		color: "#3b82f6",
		chart: [],
	},
	{
		icon: "solar:map-point-outline",
		label: "Sites Online",
		value: "12",
		color: "#f59e42",
		chart: [],
	},
	{
		icon: "mdi:filmstrip",
		label: "Total Recordings",
		value: "150",
		color: "#10b981",
		chart: [],
	},
];

const devices = [
	{ device: "timesquare", latest_heartbeat: "2023-10-01T12:00:00Z", uptime: "99.9%", status: "online" },
	{ device: "nashville", latest_heartbeat: "2023-10-01T12:00:00Z", uptime: "49.9%", status: "offline" },
];

export default function Workbench() {
	// state to track active tab
	const [activeTab, setActiveTab] = useState("All Devices");

	// filter based on activeTab
	const filteredDevices = devices.filter((tx) => {
		if (activeTab === "All Devices") return true;
		if (activeTab === "Online") return tx.status === "online";
		if (activeTab === "Offline") return tx.status === "offline";
		return true;
	});

	return (
		<div className="flex flex-col gap-4 w-full">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
									{stat.value} / {stat.value}
								</Title>
							</div>
							<div className="w-full h-10 mt-2">
								<Chart
									type="bar"
									height={40}
									options={useChart({
										chart: { sparkline: { enabled: true } },
										colors: [stat.color],
										grid: { show: false },
										yaxis: { show: false },
										tooltip: { enabled: false },
									})}
									series={[{ data: stat.chart }]}
								/>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

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
									<th className="py-2 text-right">Latest Heartbeat</th>
									<th className="py-2 text-right">Uptime</th>
									<th className="py-2 text-right">Status</th>
								</tr>
							</thead>
							<tbody>
								{filteredDevices.map((tx) => (
									<tr key={tx.device} className="border-b last:border-0">
										<td className="py-2 font-semibold">{tx.device}</td>
										<td className="py-2 text-right">{new Date(tx.latest_heartbeat).toLocaleString()}</td>
										<td className="py-2 text-right font-bold">{tx.uptime}</td>
										<td className="py-2 text-right">
											<span
												className={`text-xs font-bold inline-flex items-center gap-1 ${
													tx.status === "online" ? "text-green-500" : "text-red-500"
												}`}
											>
												{tx.status === "online" ? (
													<Icon icon="mdi:arrow-up" size={14} />
												) : (
													<Icon icon="mdi:arrow-down" size={14} />
												)}
												{tx.status}
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
