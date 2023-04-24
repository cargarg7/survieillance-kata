import { recorder, statusCallbackType } from './types';
import { sensor } from '../sensor/types';

function startRecording(recorder: recorder): recorder {
	return { ...recorder, recording: true };
}

function stopRecording(recorder: recorder): recorder {
	return { ...recorder, recording: false };
}

export function recordingBy(recorder: recorder): (sensor: sensor, statusCallback: statusCallbackType) => recorder {
	return function (sensor: sensor, statusCallback: statusCallbackType): recorder {
		return statusCallback(sensor) ? startRecording(recorder) : stopRecording(recorder);
	};
}
