import { sensor } from '../sensor/types';

export type recorder = { recording: boolean };

export type statusCallbackType = (sensor: sensor) => boolean;
