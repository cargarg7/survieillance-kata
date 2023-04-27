import { getTime } from './time';

export function wait(seconds): Promise<number> {
	return new Promise((res) => setTimeout(() => res(getTime()), seconds * 1000));
}
