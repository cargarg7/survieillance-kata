export function wait(seconds): Promise<number> {
	return new Promise((res) => setTimeout(() => res(getTime()), seconds * 1000));
}

export function getTime(): number {
	return new Date().getTime();
}
