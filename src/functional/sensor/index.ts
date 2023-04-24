import { sensor } from './types';
import { getTime } from '../helper/time';

const DEFAULT_SENSOR_STATUS = false;

export function isDetectingMotion(sensor: sensor): boolean {
	if (sensor?.error) return DEFAULT_SENSOR_STATUS;

	return sensor?.status || DEFAULT_SENSOR_STATUS;
}

function generateDetectingMotion({ status, error }: { status: boolean; error?: string }) {
	if (!error)
		return {
			status,
			time: getTime(),
		};

	return {
		error,
		status: false,
		time: getTime(),
	};
}

export function isDetectingBy(sensor: sensor) {
	let { status = DEFAULT_SENSOR_STATUS } = sensor;
	const detectingMotions: { status: boolean; time: number; error?: string }[] = [];

	return {
		sensor: function () {
			return { ...sensor, status };
		},
		updateStatus: function (sensor: sensor) {
			const { status: newStatus, error } = sensor;
			if (error) {
				detectingMotions.push(generateDetectingMotion({ status: false, error }));
				status = newStatus;
				return;
			}

			if (status !== newStatus) {
				detectingMotions.push(generateDetectingMotion({ status: newStatus }));
				status = newStatus;
				return;
			}

			return;
		},
		detectingMotionsByRage: function (minDateInTime: number, maxDateInTime: number, stepInSeconds = 1000): boolean[] {
			const result = [];
			const detectingMotionsReversed = [...detectingMotions].reverse();
			let nextMinDateInTime = minDateInTime;
			while (nextMinDateInTime <= maxDateInTime) {
				const lastDetectingMotionByDateInTime = detectingMotionsReversed.filter(
					({ time }) => time <= nextMinDateInTime
				)?.[0] || { status: DEFAULT_SENSOR_STATUS, time: nextMinDateInTime };
				result.push(lastDetectingMotionByDateInTime?.status);
				nextMinDateInTime += stepInSeconds;
			}
			return result;
		},
	};
}
