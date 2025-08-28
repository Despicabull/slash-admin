import { Card } from "@/ui/card";
import { Text } from "@/ui/typography";
import { useEffect, useState } from "react";
import { User } from "@/types/entity";
import userService from "@/api/services/userService";

export default function UsersPage() {
    const [users, setAllUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getUsers = async () => {
            try {
                setLoading(true);
                const data = await userService.fetchUsers();
                setAllUsers(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch users", err);
                setError("Failed to load users");
            } finally {
                setLoading(false);
            }
        };

        getUsers();
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
                        Users
                    </Text>
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
                                    onClick={() => handleRowClick(user.id)}
                                >
                                    <td className="py-2 font-semibold">{user.username}</td>
                                    <td className="py-2">{user.role?.name}</td>
                                    <td className="py-2">
                                        <span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {users.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No users found
                    </div>
                )}
            </Card>
        </div>
    );
}
