import { Recorder, StatusCallbackType } from './types';
import { Sensor } from '../sensor/types';

function startRecording(recorder: Recorder): Recorder {
	return { ...recorder, recording: true };
}

function stopRecording(recorder: Recorder): Recorder {
	return { ...recorder, recording: false };
}

export function recordingBy(recorder: Recorder): (sensor: Sensor, statusCallback: StatusCallbackType) => Recorder {
	return function (sensor: Sensor, statusCallback: StatusCallbackType): Recorder {
		return statusCallback(sensor) ? startRecording(recorder) : stopRecording(recorder);
	};
}
