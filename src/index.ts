const zero = (num: number) => math.max(0, num);

export class Bucket {
	private lastUpdate = 0;

	constructor(
		/** Limit of the bucket */
		private readonly limit: number,
		/** Amount drained per second, defaults to `1` */
		private readonly drainRate = 1,
		/** Initial value of the bucket, defaults to `0` */
		private value = 0,
	) {
		assert(drainRate >= 0, "bucket drainPerSecond cannot be negative");
		assert(limit > 0, "bucket limit must be greater than 0");
	}

	/** Get the current value of the bucket */
	get() {
		const now = tick(); // Use os.clock() instead?
		const delta = zero(now - this.lastUpdate);
		const drain = delta * this.drainRate;
		const value = this.value;
		if (drain === 0) return value;

		this.value = zero(value - drain);
		this.lastUpdate = now;
		return this.value;
	}

	/** Add `amount` to the bucket, negative values are ignored */
	fill(amount = 1) {
		this.value = this.get() + zero(amount);
		return this;
	}

	/** Set the amount in the bucket  */
	set(to: number) {
		// TODO: assert to > 0? zero?
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
		// TODO: assert amount > 0?
		return this.get() + amount <= this.limit;
	}

	/** Attempt to fill the bucket with `amount` */
	tryFill(amount = 1) {
		if (!this.canFill(amount)) return false;
		this.fill(amount);
		return true;
	}

	/** Attempt to fill the bucket with `amount`, throw otherwise */
	fillOrKill(amount = 1) {
		if (!this.tryFill(amount)) throw `cannot fill ${amount} into bucket with limit ${this.limit})`;
		return this;
	}

	/** Drain the bucket by `amount` */
	drain(amount = 1) {
		return (this.value = math.max(0, this.get() - amount));
	}

	/** Calculate the time (in seconds) to drain `amount` */
	timeToDrain(amount = 1) {
		return zero(amount / this.drainRate);
	}

	/** Calculate the time (in seconds) until `amount` will fit in the bucket */
	timeUntilFillable(amount = 1) {
		return this.timeToDrain(this.get() + amount - this.limit);
	}

	/** Calculate the time (in seconds) until the amount in the bucket is `value` */
	timeUntilValueIs(value: number) {
		return this.timeToDrain(this.get() - value);
	}

	/** Calculate the time (in seconds) until the bucket is empty */
	timeUntilEmpty() {
		return this.timeUntilValueIs(0);
	}
}
