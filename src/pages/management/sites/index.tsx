import deviceService from "@/api/services/deviceService";
import { Chart, useChart } from "@/components/chart";
import Icon from "@/components/icon/icon";
import { DeviceInfo, RecordingInfo } from "@/types/entity";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { Text, Title } from "@/ui/typography";
import { rgbAlpha } from "@/utils/theme";
import { useEffect, useState } from "react";

function getStatus(latestHeartbeat?: string): "online" | "offline" {
    if (!latestHeartbeat) return "offline";
    const diff = Date.now() - new Date(latestHeartbeat).getTime();
    return diff < 60 * 1000 ? "online" : "offline"; // online if < 60s
}

export default function SitesPage() {
    const [activeTab, setActiveTab] = useState("All Devices");
    const [allDevices, setAllDevices] = useState<DeviceInfo[]>([]);
    const [allRecordings, setAllRecordings] = useState<RecordingInfo[]>([]);

    useEffect(() => {
        const getDevices = async () => {
            try {
                const data = await deviceService.fetchDevices();
                setAllDevices(data);
            } catch (error) {
                console.error("Failed to fetch devices", error);
            }
        };

        // 🔹 Fetch recordings (replace with your real API call)
        const getRecordings = async () => {
            try {
                // TODO: implement fetchRecordings service
                setAllRecordings([]);
            } catch (error) {
                console.error("Failed to fetch recordings", error);
            }
        };

        getDevices();
        getRecordings();
    }, []);

    // 🔹 Enrich devices with status
    const enrichedDevices = allDevices.map((d) => ({
        ...d,
        status: getStatus(d.lastHeartbeat),
    }));

    // 🔹 Quick stats values
    const onlineCount = enrichedDevices.filter((d) => d.status === "online").length;
    const totalDevices = enrichedDevices.length;
    const totalRecordings = allRecordings.length;

    // 🔹 Quick stats (only devices x/y and total recordings)
    const quickStats = [
        {
            icon: "mdi:devices",
            label: "Devices",
            value: `${onlineCount} / ${totalDevices}`,
            color: "#3b82f6",
            chart: [],
        },
        {
            icon: "mdi:filmstrip",
            label: "Recordings",
            value: String(totalRecordings),
            color: "#10b981",
            chart: [],
        },
    ];

    // 🔹 Filter based on tab
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
                                <div
                                    className="rounded-lg p-2"
                                    style={{ background: rgbAlpha(stat.color, 0.1) }}
                                >
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
