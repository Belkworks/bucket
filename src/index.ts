const zero = (num: number) => math.max(0, num);

export class Bucket {
	private lastUpdate = tick();
	private value: number;

	constructor(
		/** Limit of the bucket */
		private readonly limit: number,
		/** Amount drained per second, defaults to `1`, must be >=0 */
		private readonly drainRate = 1,
		/** Initial value of the bucket, defaults to `0` */
		value = 0,
	) {
		assert(drainRate >= 0, "bucket drainPerSecond must be >=0");
		assert(limit > 0, "bucket limit must be greater than 0");
		this.value = zero(value);
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
		if (amount <= 0) return this;
		this.value = this.get() + amount;
		return this;
	}

	/** Set the amount in the bucket, negative values are replaced with 0 */
	set(to: number) {
		this.value = zero(to);
		this.lastUpdate = tick();
		return this;
	}

	/** Empty the bucket */
	empty() {
		return this.set(0);
	}

	/** Check if the bucket is empty */
	isEmpty() {
		return this.get() === 0;
	}

	/** Check if the `amount` can fit in the bucket */
	canFill(amount = 1) {
		// TODO: assert amount > 0?
		return this.get() + amount <= this.limit;
	}

	/** Attempt to fill the bucket with `amount`, returns success */
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

	/** Calculate the drainRate to drain `amount` in `seconds` */
	static calculateRate(amount: number, seconds: number) {
		return amount / seconds;
	}
}
