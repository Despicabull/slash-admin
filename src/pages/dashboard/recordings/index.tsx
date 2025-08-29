import { useEffect, useState } from "react";
import type { Device, Recording } from "#/entity";
import deviceService from "@/api/services/deviceService";
import recordingService from "@/api/services/recordingService";
import Icon from "@/components/icon/icon";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Checkbox } from "@/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/ui/dropdown-menu";
import { Text } from "@/ui/typography";
import { VideoCard } from "./video-card";

export default function RecordingsPage() {
	const [recordings, setRecordings] = useState<Recording[]>([]);
	const [recordingsLoading, setRecordingsLoading] = useState(true);
	const [recordingsError, setRecordingsError] = useState<string | null>(null);
	const [devices, setDevices] = useState<Device[]>([]);
	const [devicesLoading, setDevicesLoading] = useState(true);
	const [devicesError, setDevicesError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
	const [date, setDate] = useState("");

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
		const getRecordings = async () => {
			try {
				setRecordingsLoading(true);
				const data = await recordingService.fetchRecordings(page, limit, selectedDevices, date);
				setRecordings(data);
				setRecordingsError(null);
			} catch (err) {
				console.error("Failed to fetch recordings", err);
				setRecordingsError("Failed to load recordings");
			} finally {
				setRecordingsLoading(false);
			}
		};

		getRecordings();
	}, [page, limit, selectedDevices, date]);

	if (devicesLoading) {
		return <div className="p-6">Loading devices...</div>;
	}

	if (devicesError) {
		return <div className="p-6 text-red-500">{devicesError}</div>;
	}

	if (recordingsLoading) {
		return <div className="p-6">Loading recordings...</div>;
	}

	if (recordingsError) {
		return <div className="p-6 text-red-500">{recordingsError}</div>;
	}

	const handleDeviceChange = (deviceName: string) => {
		setSelectedDevices((prev) =>
			prev.includes(deviceName) ? prev.filter((d) => d !== deviceName) : [...prev, deviceName],
		);
	};

	const clearFilters = () => {
		setSelectedDevices([]);
		setDate("");
	};

	return (
		<div className="flex flex-col gap-4 w-full">
			<Card className="flex flex-col p-6">
				<div className="flex flex-col gap-4 mb-4">
					<div className="flex items-center justify-between">
						<Text variant="body2" className="font-semibold text-lg">
							Recordings
						</Text>
						<Button size="sm" variant="ghost" onClick={clearFilters} className="text-gray-500 hover:text-gray-700">
							<Icon icon="mdi:filter-off" size={16} />
							Clear Filters
						</Button>
					</div>

					<div className="flex gap-2 flex-wrap items-center">
						<div className="flex items-center gap-2">
							<Icon icon="mdi:calendar" size={16} color="#6b7280" />
							<input
								type="date"
								value={date}
								onChange={(e) => setDate(e.target.value)}
								className="border rounded px-2 py-1 text-sm"
								placeholder="Filter by date"
							/>
						</div>

						<div className="flex items-center gap-2">
							<Icon icon="mdi:camera" size={16} color="#6b7280" />
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline">Devices ({selectedDevices.length})</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									{devices.map((device) => (
										<DropdownMenuItem key={device.id} onSelect={(e) => e.preventDefault()}>
											<Checkbox
												checked={selectedDevices.includes(device.name)}
												onCheckedChange={() => handleDeviceChange(device.name)}
											/>
											<span className="ml-2">{device.name}</span>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</div>

				<div className="mb-4">
					<Text variant="body2" className="text-gray-500">
						Showing {recordings.length} recording{recordings.length !== 1 ? "s" : ""} - Page {page}
					</Text>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{recordings.length > 0 ? (
						recordings.map((recording) => <VideoCard key={recording.id} recording={recording} />)
					) : (
						<div className="col-span-full py-12 text-center text-gray-500">
							<Icon icon="mdi:filmstrip-off" size={48} color="#d1d5db" className="mx-auto mb-4" />
							<Text>No recordings found</Text>
						</div>
					)}
				</div>
				<div className="flex items-center justify-end space-x-2 py-4">
					<Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
						Previous
					</Button>
					<Button variant="outline" size="sm" onClick={() => setPage(page + 1)}>
						Next
					</Button>
				</div>
			</Card>
		</div>
	);
}
