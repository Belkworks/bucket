const zero = (num: number) => math.max(0, num);

export class Bucket {
	private lastUpdate = 0;

	constructor(
		private readonly limit: number,
		private readonly drainPerSecond = 1,
		private value = 0,
	) {
		assert(drainPerSecond > 0, "bucket: drainedPerSecond must be greater than 0");
		assert(limit > 0, "bucket: limit must be greater than 0");
	}

	/** Get the current value of the Bucket */
	get() {
		const now = tick(); // Use os.clock() instead?
		const delta = zero(now - this.lastUpdate);
		this.value = zero(this.value - delta * this.drainPerSecond);
		this.lastUpdate = now;
		return this.value;
	}

	/** Add to the bucket */
	fill(amount = 1) {
		this.value = this.get() + amount;
		return this;
	}

	/** Set the amount in the Bucket  */
	set(to: number) {
		this.value = to;
		this.lastUpdate = tick();
		return this;
	}

	/** Empty the bucket */
	reset() {
		return this.set(0);
	}

	/** Check if the `amount` can fit in the bucket */
	canFill(amount = 1) {
		return this.get() + amount <= this.limit;
	}

	/** Attempt to fill the bucket with `amount` */
	tryFill(amount = 1) {
		if (!this.canFill(amount)) return false;
		this.fill(amount);
		return true;
	}

	/** Drain the bucket by `amount` */
	drain(amount = 1) {
		return (this.value = math.max(0, this.get() - amount));
	}

	/** Calculate the time (in seconds) to drain `amount` */
	timeToDrain(amount = 1) {
		return zero(amount / this.drainPerSecond);
	}

	/** Calculate the time (in seconds) until `amount` will fit in the Bucket */
	timeUntilFillable(amount = 1) {
		return this.timeToDrain(this.get() + amount - this.limit);
	}

	/** Calculate the time (in seconds) until the amount in the Bucket will be `value` */
	timeUntilValueIs(value: number) {
		return this.timeToDrain(this.get() - value);
	}

	/** Calculate the time (in seconds) until the Bucket is empty */
	timeUntilEmpty() {
		return this.timeUntilValueIs(0);
	}
}
