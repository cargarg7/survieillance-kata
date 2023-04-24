import { Sensor, DetectingMotion, DetectingBy } from './types';
import { getTime } from '../helper/time';
import { DEFAULT_SENSOR_STATUS, STATUS } from './enums';

function generateDetectingMotion({ status, error }: Sensor): DetectingMotion {
	const baseDetectingMotion = { status, time: getTime() };
	return !error ? baseDetectingMotion : { ...baseDetectingMotion, status: STATUS.FALSE, error };
}

export function isDetectingMotion(sensor: Sensor): boolean {
	if (sensor?.error) return STATUS.FALSE;

	return sensor?.status || DEFAULT_SENSOR_STATUS;
}

export function isDetectingBy(sensor: Sensor): DetectingBy {
	let { status = DEFAULT_SENSOR_STATUS } = sensor;
	const detectingMotions: { status: boolean; time: number; error?: string }[] = [];

	return {
		sensor: function () {
			return { ...sensor, status };
		},
		updateStatus: function (sensor) {
			const { status: newStatus, error } = sensor;
			if (error) {
				detectingMotions.push(generateDetectingMotion({ status: STATUS.FALSE, error }));
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
		detectingMotionsByRageEveryTime: function (minDateInTime, maxDateInTime, stepInSeconds = 1000) {
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
