import deviceService from "@/api/services/deviceService";
import { Device } from "@/types/entity";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Text } from "@/ui/typography";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getDeviceStatus } from "@/utils/device";

export default function DevicesPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("All Devices");
    const [allDevices, setAllDevices] = useState<Device[]>([]);

    useEffect(() => {
        const getDevices = async () => {
            try {
                const data = await deviceService.fetchDevices();
                setAllDevices(data);
            } catch (error) {
                console.error("Failed to fetch devices", error);
            }
        };

        getDevices();
    }, []);

    // Enrich devices with status
    const enrichedDevices = allDevices.map((d) => ({
        ...d,
        status: getDeviceStatus(d.lastHeartbeat),
    }));

    // Filter based on tab
    const filteredDevices = enrichedDevices.filter((d) => {
        if (activeTab === "All Devices") return true;
        if (activeTab === "Online") return d.status === "online";
        if (activeTab === "Offline") return d.status === "offline";
        return true;
    });

    const handleRowClick = (id: string) => {
        navigate(`/management/devices/${id}`);
    };

    return (
        <div className="flex flex-col gap-4 w-full">
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
                                    <tr 
                                        key={d.id} 
                                        className="border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => handleRowClick(d.id)}
                                    >
                                        <td className="py-2 font-semibold">{d.name}</td>
                                        <td className="py-2 text-right">
                                            {d.lastHeartbeat
                                                ? new Date(d.lastHeartbeat).toLocaleString()
                                                : "No heartbeat"}
                                        </td>
                                        <td className="py-2 text-right">{d.uptime}</td>
                                        <td className="py-2 text-right">
                                            <span
                                                className={`text-xs font-bold inline-flex items-center gap-1 ${
                                                    d.status === "online"
                                                        ? "text-green-500"
                                                        : "text-red-500"
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
