import permissionService from "@/api/services/permissionService";
import { Permission } from "@/types/entity";
import { Card } from "@/ui/card";
import { Text } from "@/ui/typography";
import { useEffect, useState } from "react";

export default function PermissionsPage() {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                setLoading(true);
                const data = await permissionService.fetchPermissions();
                setPermissions(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch permissions", err);
                setError("Failed to load permissions");
            } finally {
                setLoading(false);
            }
        };

        fetchPermissions();
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
                        Permissions
                    </Text>
                </div>
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left border-b">
                                <th className="py-2">Name</th>
                                <th className="py-2">Code</th>
                                <th className="py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {permissions.map((permission) => (
                                <tr 
                                    key={permission.id} 
                                    className="border-b last:border-0 cursor-pointer"
                                    onClick={() => handleRowClick(permission.id)}
                                >
                                    <td className="py-2 font-semibold">{permission.name}</td>
                                    <td className="py-2">{permission.code}</td>
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
                {permissions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No permissions found
                    </div>
                )}
            </Card>
        </div>
    );
}
