import { Sensor } from '../sensor/types';

export type Recorder = { recording: boolean };

export type StatusCallbackType = (sensor: Sensor) => boolean;
