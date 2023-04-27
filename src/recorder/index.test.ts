import { recordingBy } from './index';
import { Sensor } from '../sensor/types';
import { Recorder, StatusCallbackType } from './types';

describe('Recorder', () => {
	it('Should video recorder stop recording when motion sensor by default', () => {
		const isDetectingMotionSpy: StatusCallbackType = jest.fn((): boolean => false);
		const sensor: Sensor = { status: false };
		const recorder: Recorder = { recording: false };
		const recordingBySensor = recordingBy(recorder);
		expect(recordingBySensor(sensor, isDetectingMotionSpy)).toEqual({ recording: false });
	});

	it('Should video recorder stop recording when motion sensor is false', () => {
		const isDetectingMotionSpy: StatusCallbackType = jest.fn((): boolean => false);
		const sensor: Sensor = { status: false };
		const recorder: Recorder = { recording: false };
		const recordingBySensor = recordingBy(recorder);
		expect(recordingBySensor(sensor, isDetectingMotionSpy)).toEqual({ recording: false });
	});

	it('Should video recorder stop recording when motion sensor throw unexpected error', () => {
		const isDetectingMotionSpy: StatusCallbackType = jest.fn((): boolean => false);
		const sensor: Sensor = { status: false, error: 'Connection Error' };
		const recorder: Recorder = { recording: false };
		const recordingBySensor = recordingBy(recorder);
		expect(recordingBySensor(sensor, isDetectingMotionSpy)).toEqual({ recording: false });
	});

	it('Should video recorder start recording when motion sensor is true', () => {
		const isDetectingMotionSpy: StatusCallbackType = jest.fn((): boolean => true);
		const sensor: Sensor = { status: true };
		const recorder: Recorder = { recording: false };
		const recordingBySensor = recordingBy(recorder);
		expect(recordingBySensor(sensor, isDetectingMotionSpy)).toEqual({ recording: true });
	});
});
