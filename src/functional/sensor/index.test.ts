import { wait, getTime } from '../helper/time';
import { isDetectingBy, isDetectingMotion } from './index';
import { sensor } from './types';

describe('Sensor', () => {
	describe('isDetectingMotion', () => {
		it('Should return FALSE if sensor has ERROR', () => {
			const sensor: sensor = { status: false, error: 'Connection Error' };
			expect(isDetectingMotion(sensor)).toBe(false);
		});

		it('Should return FALSE if sensor has no status property', () => {
			const sensor = {};
			expect(isDetectingMotion(sensor as sensor)).toBe(false);
		});

		it('Should return FALSE if sensor has FALSE status', () => {
			const sensor: sensor = { status: false };
			expect(isDetectingMotion(sensor)).toBe(false);
		});

		it('Should return TRUE if sensor has TRUE status', () => {
			const sensor: sensor = { status: true };
			expect(isDetectingMotion(sensor)).toBe(true);
		});
	});

	describe('isDetectingBy', () => {
		it('Should check status every second', async () => {
			// Registry status updates...
			const stepInSeconds = 100;
			const sensor = { status: false };
			const isDetectingBySensor = isDetectingBy(sensor);
			const startTime = getTime(); // start
			await wait(0.01); // step 1
			isDetectingBySensor.updateStatus({ status: true });
			await wait(0.1); // step 2
			isDetectingBySensor.updateStatus({ status: false, error: 'Connection Error' });
			await wait(0.2); // step 3 and step 4
			isDetectingBySensor.updateStatus({ status: true });
			const endTime = await wait(0.2); // end --> step 5 and 6

			// detectinMotions status
			const steps = Math.ceil((endTime - startTime) / stepInSeconds);
			const results = isDetectingBySensor.detectingMotionsByRage(startTime, endTime, stepInSeconds);
			expect(results.length).toBe(steps);
			expect(results).toEqual([false, true, false, false, true, true]);
			// last sensor status
			const newSensor = isDetectingBySensor.sensor();
			expect(newSensor).toEqual({ status: true });
		});

		it('Should return false default record status if time searched before recording time', async () => {
			// Registry status updates...
			const stepInSeconds = 100;
			const sensor = { status: false };
			const isDetectingBySensor = isDetectingBy(sensor);
			const startTime = getTime(); // start
			await wait(0.01); // step 1
			isDetectingBySensor.updateStatus({ status: true });
			await wait(0.1); // step 2
			isDetectingBySensor.updateStatus({ status: false });
			await wait(0.1); // step 3
			isDetectingBySensor.updateStatus({ status: true });
			const endTime = await wait(0.2); // end --> step 4 and 5

			// detectinMotions status
			const endTimeBefore = endTime - 1000;
			const startTimeBefore = startTime - 1000;
			const steps = Math.ceil((endTimeBefore - startTimeBefore) / stepInSeconds);
			const results = isDetectingBySensor.detectingMotionsByRage(startTimeBefore, endTimeBefore, stepInSeconds);
			expect(results.length).toBe(steps);
			expect(results).toEqual([false, false, false, false, false]);
		});

		it('Should return last status recorded if time searched after recording time', async () => {
			// Registry status updates...
			const stepInSeconds = 100;
			const sensor = { status: false };
			const isDetectingBySensor = isDetectingBy(sensor);
			const startTime = getTime(); // start
			await wait(0.01); // step 1
			isDetectingBySensor.updateStatus({ status: true });
			await wait(0.1); // step 2
			isDetectingBySensor.updateStatus({ status: false });
			await wait(0.1); // step 3
			isDetectingBySensor.updateStatus({ status: true });
			const endTime = await wait(0.2); // end --> step 4 and 5

			// detectinMotions status
			const endTimeBefore = endTime + 1000;
			const startTimeBefore = startTime + 1000;
			const steps = Math.ceil((endTimeBefore - startTimeBefore) / stepInSeconds);
			const results = isDetectingBySensor.detectingMotionsByRage(startTimeBefore, endTimeBefore, stepInSeconds);
			expect(results.length).toBe(steps);
			expect(results).toEqual([true, true, true, true, true]);
		});
	});
});
