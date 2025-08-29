import { useState } from "react";
import type { Recording } from "#/entity";
import { Card, CardContent } from "@/ui/card";
import { Text } from "@/ui/typography";

export interface VideoCardProps {
	recording: Recording;
}

export const VideoCard = ({ recording }: VideoCardProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleCardClick = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const handleModalKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			closeModal();
		}
	};

	const { videoSrc, startTime, endTime, deviceName } = recording;

	const startDate = new Date(startTime);
	const endDate = new Date(endTime);

	const monthDay = startDate.toLocaleDateString([], { month: "long", day: "numeric" });
	const startHours = startDate.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	});
	const endHours = endDate.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	});

	return (
		<>
			<Card className="flex flex-col justify-between h-full">
				<CardContent className="p-4">
					<button
						type="button"
						onClick={handleCardClick}
						className="w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-all hover:shadow-lg"
						aria-label={`Play recording from ${deviceName} on ${monthDay} from ${startHours} to ${endHours}`}
					>
						<video
							src={videoSrc}
							className="w-full aspect-video object-cover rounded mb-4 pointer-events-none"
							preload="metadata"
							muted
							tabIndex={-1}
						>
							<track kind="captions" srcLang="en" label="English captions" default />
						</video>
						<Text>{monthDay}</Text>
						<Text>
							{startHours} - {endHours}
						</Text>
						<Text>{deviceName}</Text>
					</button>
				</CardContent>
			</Card>

			{/* Modal */}
			{isModalOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
					onKeyDown={handleModalKeyDown}
					role="dialog"
					aria-modal="true"
					aria-labelledby="modal-title"
				>
					<div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] w-full mx-4">
						<div className="flex justify-between items-center mb-4">
							<Text id="modal-title" className="text-lg font-semibold">
								Recording
							</Text>
							<button
								type="button"
								onClick={closeModal}
								className="text-gray-500 hover:text-gray-700 text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
								aria-label="Close modal"
							>
								×
							</button>
						</div>
						<video src={videoSrc} controls autoPlay className="w-full h-auto rounded">
							<track kind="captions" src="/path/to/captions.vtt" srcLang="en" label="English captions" default />
							Your browser does not support the video tag.
						</video>
						<div className="mt-4 text-sm text-gray-600">
							<Text>
								{deviceName} | {monthDay} | {startHours} - {endHours}
							</Text>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
