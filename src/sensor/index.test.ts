import { wait } from '../helper/wait';
import { getTime } from '../helper/time';
import { isDetectingBy, isDetectingMotion } from './index';
import { DetectingBy, Sensor } from './types';

function expectDetectionMotions<T>(list: T[]) {
	return listMatchers(list);
}

function listMatchers<T>(list: T[]) {
	return {
		isExactly(...items: T[]) {
			expect(items.length).toBe(list.length);
			items.forEach((_: T, i: number) => {
				expect(items[i]).toBe(list[i]);
			});
		},
	};
}

describe('Sensor', () => {
	describe('isDetectingMotion', () => {
		it('Should return FALSE if sensor has ERROR', () => {
			const sensor: Sensor = { status: false, error: 'Connection Error' };
			expect(isDetectingMotion(sensor)).toBe(false);
		});

		it('Should return FALSE if sensor has no status property', () => {
			const sensor = {};
			expect(isDetectingMotion(sensor as Sensor)).toBe(false);
		});

		it('Should return FALSE if sensor has FALSE status', () => {
			const sensor: Sensor = { status: false };
			expect(isDetectingMotion(sensor)).toBe(false);
		});

		it('Should return TRUE if sensor has TRUE status', () => {
			const sensor: Sensor = { status: true };
			expect(isDetectingMotion(sensor)).toBe(true);
		});
	});

	describe('isDetectingBy', () => {
		let isDetectingBySensor: DetectingBy;
		let startTime: number;
		let endTime: number;
		beforeEach(async () => {
			const sensor: Sensor = { status: false };
			isDetectingBySensor = isDetectingBy(sensor);
			startTime = getTime(); // start
			await wait(0.01); // step 1
			isDetectingBySensor.updateStatus({ status: true });
			await wait(0.1); // step 2
			isDetectingBySensor.updateStatus({ status: false, error: 'Connection Error' });
			await wait(0.2); // step 3 and step 4
			isDetectingBySensor.updateStatus({ status: true });
			endTime = await wait(0.2); // end --> step 5 and 6
		});

		it('Should check status every second', async () => {
			const stepInSeconds = 100;
			// detectinMotions status
			const results = isDetectingBySensor.detectingMotionsByRageEveryTime(startTime, endTime, stepInSeconds);
			expectDetectionMotions(results).isExactly(false, true, false, false, true, true);
			// last sensor status
			const newSensor = isDetectingBySensor.sensor();
			expect(newSensor).toEqual({ status: true });
		});

		it('Should return false default record status if time searched before recording time', async () => {
			// Registry status updates...
			const stepInSeconds = 100;
			// detectinMotions status
			const endTimeBefore = endTime - 1000;
			const startTimeBefore = startTime - 1000;
			const results = isDetectingBySensor.detectingMotionsByRageEveryTime(
				startTimeBefore,
				endTimeBefore,
				stepInSeconds
			);
			expectDetectionMotions(results).isExactly(false, false, false, false, false, false);
		});

		it('Should return last status recorded if time searched after recording time', async () => {
			// Registry status updates...
			const stepInSeconds = 100;
			// detectinMotions status
			const endTimeBefore = endTime + 1000;
			const startTimeBefore = startTime + 1000;
			const results = isDetectingBySensor.detectingMotionsByRageEveryTime(
				startTimeBefore,
				endTimeBefore,
				stepInSeconds
			);
			expectDetectionMotions(results).isExactly(true, true, true, true, true, true);
		});
	});
});
