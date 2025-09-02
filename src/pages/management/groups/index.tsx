import { useEffect, useState } from "react";
import groupService from "@/api/services/groupService";
import EntityModal from "@/components/management/EntityModal";
import type { Group } from "@/types/entity";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Text } from "@/ui/typography";

export default function GroupsPage() {
	const [groups, setGroups] = useState<Group[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

	useEffect(() => {
		const fetchGroups = async () => {
			try {
				setLoading(true);
				const data = await groupService.fetchGroups();
				setGroups(data);
				setError(null);
			} catch (err) {
				console.error("Failed to fetch groups", err);
				setError("Failed to load groups");
			} finally {
				setLoading(false);
			}
		};

		fetchGroups();
	}, []);

	const handleRowClick = (group: Group) => {
		setSelectedGroup(group);
		setIsModalOpen(true);
	};

	const handleCreateGroup = () => {
		setSelectedGroup(null);
		setIsModalOpen(true);
	};

	const handleSaveGroup = async (data: any) => {
		try {
			if (selectedGroup) {
				// Update existing group
				await groupService.updateGroup(selectedGroup.id, data);
			} else {
				// Create new group
				await groupService.createGroup(data);
			}
			// Refresh the list
			const updatedGroups = await groupService.fetchGroups();
			setGroups(updatedGroups);
		} catch (err) {
			console.error("Failed to save group", err);
			throw err;
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		// Delay resetting selectedGroup to prevent title flicker during modal close animation
		setTimeout(() => {
			setSelectedGroup(null);
		}, 150);
	};

	if (loading) {
		return <div className="p-6">Loading groups...</div>;
	}

	if (error) {
		return <div className="p-6 text-red-500">{error}</div>;
	}

	return (
		<div className="flex flex-col gap-4 w-full">
			<Card className="flex flex-col p-6">
				<div className="flex items-center gap-4 mb-4">
					<Text variant="body2" className="font-semibold">
						Groups
					</Text>
					<Button onClick={handleCreateGroup} size="sm">
						Add Group
					</Button>
				</div>
				<div className="flex-1 overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="text-left border-b">
								<th className="py-2">Name</th>
								<th className="py-2">Type</th>
								<th className="py-2">Devices</th>
								<th className="py-2">Status</th>
							</tr>
						</thead>
						<tbody>
							{groups.map((group) => (
								<tr
									key={group.id}
									className="border-b last:border-0 cursor-pointer"
									onClick={() => handleRowClick(group)}
								>
									<td className="py-2 font-semibold">{group.name}</td>
									<td className="py-2">{group.type}</td>
									<td className="py-2">{group.devices ? group.devices.length : 0} devices</td>
									<td className="py-2">
										<span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-800">Active</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{groups.length === 0 && <div className="text-center py-8 text-gray-500">No groups found</div>}
			</Card>

			<EntityModal
				open={isModalOpen}
				onClose={handleCloseModal}
				onSubmit={handleSaveGroup}
				title={selectedGroup ? "Edit Group" : "Add Group"}
				entity={selectedGroup}
				entityType="group"
			/>
		</div>
	);
}
