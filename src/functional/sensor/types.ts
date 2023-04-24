export type Sensor = { status: boolean; error?: string };

export type DetectingMotion = Sensor & { time: number };

export type DetectingBy = {
	sensor: () => Sensor;
	updateStatus: (sensor: Sensor) => void;
	detectingMotionsByRageEveryTime: (minDateIntTime: number, maxDateInTime: number, stepInSeconds: number) => boolean[];
};
