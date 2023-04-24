import { recordingBy } from './index';
import { isDetectingMotion } from '../sensor';
import { sensor } from '../sensor/types';
import { recorder } from './types';

describe('Recorder', () => {
	it('Should video recorder stop recording when motion sensor by default', () => {
		const sensor: sensor = { status: false };
		const recorder: recorder = { recording: false };
		const recordingBySensor = recordingBy(recorder);
		expect(recordingBySensor(sensor, isDetectingMotion)).toEqual({ recording: false });
	});

	it('Should video recorder stop recording when motion sensor is false', () => {
		const sensor: sensor = { status: false };
		const recorder: recorder = { recording: false };
		const recordingBySensor = recordingBy(recorder);
		expect(recordingBySensor(sensor, isDetectingMotion)).toEqual({ recording: false });
	});

	it('Should video recorder stop recording when motion sensor throw unexpected error', () => {
		const sensor: sensor = { status: false, error: 'Connection Error' };
		const recorder: recorder = { recording: false };
		const recordingBySensor = recordingBy(recorder);
		expect(recordingBySensor(sensor, isDetectingMotion)).toEqual({ recording: false });
	});

	it('Should video recorder start recording when motion sensor is true', () => {
		const sensor: sensor = { status: true };
		const recorder: recorder = { recording: false };
		const recordingBySensor = recordingBy(recorder);
		expect(recordingBySensor(sensor, isDetectingMotion)).toEqual({ recording: true });
	});
});
