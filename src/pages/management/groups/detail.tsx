import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import groupService from "@/api/services/groupService";
import type { Group } from "@/types/entity";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Text } from "@/ui/typography";

export default function GroupDetailPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [group, setGroup] = useState<Group | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) return;

		const fetchGroup = async () => {
			try {
				setLoading(true);
				const data = await groupService.fetchByGroupId(id);
				setGroup(data || null);
				setError(null);
			} catch (err) {
				console.error("Failed to fetch group", err);
				setError("Failed to load group details");
			} finally {
				setLoading(false);
			}
		};

		fetchGroup();
	}, [id]);

	if (loading) {
		return <div className="p-6">Loading group details...</div>;
	}

	if (error) {
		return <div className="p-6 text-red-500">{error}</div>;
	}

	if (!group) {
		return <div className="p-6">Group not found</div>;
	}

	return (
		<div className="flex flex-col gap-4 w-full">
			<Button variant="outline" onClick={() => navigate(-1)} className="w-fit">
				← Back to Groups
			</Button>

			<Card className="p-6">
				<div className="flex items-center justify-between mb-6">
					<Text variant="body2" className="font-semibold">
						Group: {group.name}
					</Text>
					<span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-800">Active</span>
				</div>

				{/* Group Information */}
				<div className="mb-8">
					<Text variant="body2" className="font-semibold mb-4 block">
						Group Information
					</Text>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-4">
							<div>
								<Text variant="body2" className="text-gray-500">
									ID
								</Text>
								<Text variant="body1" className="font-medium">
									{group.id}
								</Text>
							</div>

							<div>
								<Text variant="body2" className="text-gray-500">
									Name
								</Text>
								<Text variant="body1" className="font-medium">
									{group.name}
								</Text>
							</div>
						</div>

						<div className="space-y-4">
							<div>
								<Text variant="body2" className="text-gray-500">
									Type
								</Text>
								<Text variant="body1" className="font-medium">
									{group.type}
								</Text>
							</div>

							<div>
								<Text variant="body2" className="text-gray-500">
									Devices
								</Text>
								<Text variant="body1" className="font-medium">
									{group.devices ? group.devices.length : 0} assigned
								</Text>
							</div>
						</div>
					</div>
				</div>

				{/* Assigned Devices */}
				<div>
					<Text variant="body2" className="font-semibold mb-4 block">
						Assigned Devices
					</Text>
					{group.devices && group.devices.length > 0 ? (
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="text-left border-b">
										<th className="py-2">Device Name</th>
										<th className="py-2">Version</th>
										<th className="py-2">Hostname</th>
										<th className="py-2">Status</th>
									</tr>
								</thead>
								<tbody>
									{group.devices.map((device) => (
										<tr key={device.id} className="border-b last:border-0">
											<td className="py-2 font-semibold">{device.name}</td>
											<td className="py-2">{device.version || "N/A"}</td>
											<td className="py-2">{device.hostname || "N/A"}</td>
											<td className="py-2">
												<span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-800">Active</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<div className="text-center py-8 text-gray-500">No devices assigned to this group</div>
					)}
				</div>
			</Card>
		</div>
	);
}
