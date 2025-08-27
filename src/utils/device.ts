export function getDeviceStatus(latestHeartbeat?: string): "online" | "offline" {
    if (!latestHeartbeat) return "offline";
    const diff = Date.now() - new Date(latestHeartbeat).getTime();
    return diff < 60 * 1000 ? "online" : "offline"; // online if < 60s
}
