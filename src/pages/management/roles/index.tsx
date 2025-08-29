import { useEffect, useState } from "react";
import roleService from "@/api/services/roleService";
import type { Role } from "@/types/entity";
import { Card } from "@/ui/card";
import { Text } from "@/ui/typography";

export default function RolesPage() {
	const [roles, setRoles] = useState<Role[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchRoles = async () => {
			try {
				setLoading(true);
				const data = await roleService.fetchRoles();
				setRoles(data);
				setError(null);
			} catch (err) {
				console.error("Failed to fetch roles", err);
				setError("Failed to load roles");
			} finally {
				setLoading(false);
			}
		};

		fetchRoles();
	}, []);

	const handleRowClick = (id: string) => {
		// TODO: Add a modal window to allow editing the role
	};

	if (loading) {
		return <div className="p-6">Loading roles...</div>;
	}

	if (error) {
		return <div className="p-6 text-red-500">{error}</div>;
	}

	return (
		<div className="flex flex-col gap-4 w-full">
			<Card className="flex flex-col p-6">
				<div className="flex items-center gap-4 mb-4">
					<Text variant="body2" className="font-semibold">
						Roles
					</Text>
				</div>
				<div className="flex-1 overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="text-left border-b">
								<th className="py-2">Name</th>
								<th className="py-2">Permissions</th>
								<th className="py-2">Status</th>
							</tr>
						</thead>
						<tbody>
							{roles.map((role) => (
								<tr
									key={role.id}
									className="border-b last:border-0 cursor-pointer"
									onClick={() => handleRowClick(role.id)}
								>
									<td className="py-2 font-semibold">{role.name}</td>
									<td className="py-2">{role.permissions ? role.permissions.length : 0} permissions</td>
									<td className="py-2">
										<span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-800">Active</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{roles.length === 0 && <div className="text-center py-8 text-gray-500">No roles found</div>}
			</Card>
		</div>
	);
}
