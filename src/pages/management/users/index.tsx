import { useEffect, useState } from "react";
import roleService from "@/api/services/roleService";
import userService from "@/api/services/userService";
import EntityModal from "@/components/management/EntityModal";
import type { Role, User } from "@/types/entity";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Text } from "@/ui/typography";

export default function UsersPage() {
	const [users, setAllUsers] = useState<User[]>([]);
	const [roles, setRoles] = useState<Role[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				// Fetch users and roles in parallel
				const [usersData, rolesData] = await Promise.all([userService.fetchUsers(), roleService.fetchRoles()]);
				setAllUsers(usersData);
				setRoles(rolesData);
				setError(null);
			} catch (err) {
				console.error("Failed to fetch data", err);
				setError("Failed to load data");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleRowClick = (user: User) => {
		setSelectedUser(user);
		setIsModalOpen(true);
	};

	const handleCreateUser = () => {
		setSelectedUser(null);
		setIsModalOpen(true);
	};

	const handleSaveUser = async (data: any) => {
		try {
			// Ensure role is properly formatted for the API
			const userData = {
				...data,
				role: data.role ? { id: data.role.id, name: data.role.name, code: data.role.code } : undefined,
			};

			if (selectedUser) {
				// Update existing user
				await userService.updateUser(selectedUser.id, userData);
			} else {
				// For user creation, ensure password is provided
				if (!data.password) {
					throw new Error("Password is required for new users");
				}
				// Create new user
				await userService.createUser(userData);
			}
			// Refresh the list
			const updatedUsers = await userService.fetchUsers();
			setAllUsers(updatedUsers);
		} catch (err) {
			console.error("Failed to save user", err);
			throw err;
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		// Reset selectedUser after a brief delay to prevent title flicker
		setTimeout(() => {
			setSelectedUser(null);
		}, 100);
	};

	if (loading) {
		return <div className="p-6">Loading users...</div>;
	}

	if (error) {
		return <div className="p-6 text-red-500">{error}</div>;
	}

	return (
		<div className="flex flex-col gap-4 w-full">
			<Card className="flex flex-col p-6">
				<div className="flex items-center gap-4 mb-4">
					<Text variant="body2" className="font-semibold">
						Users
					</Text>
					<Button onClick={handleCreateUser} size="sm">
						Add User
					</Button>
				</div>
				<div className="flex-1 overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="text-left border-b">
								<th className="py-2">Username</th>
								<th className="py-2">Role</th>
								<th className="py-2">Status</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<tr
									key={user.id}
									className="border-b last:border-0 cursor-pointer"
									onClick={() => handleRowClick(user)}
								>
									<td className="py-2 font-semibold">{user.username}</td>
									<td className="py-2">{user.role?.name}</td>
									<td className="py-2">
										<span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-800">Active</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{users.length === 0 && <div className="text-center py-8 text-gray-500">No users found</div>}
			</Card>

			<EntityModal
				open={isModalOpen}
				onClose={handleCloseModal}
				onSubmit={handleSaveUser}
				title={selectedUser ? "Edit User" : "Add User"}
				entity={selectedUser}
				entityType="user"
				roles={roles}
			/>
		</div>
	);
}
