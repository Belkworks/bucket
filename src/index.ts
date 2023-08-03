// Bucket
// safazi 2023

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
		if (drainRate < 0) throw "bucket drainPerSecond must be >=0";
		if (limit <= 0) throw "bucket limit must be greater than 0";
		this.value = zero(value);
	}

	private markDelta() {
		const now = tick(); // Use os.clock() instead?
		const delta = zero(now - this.lastUpdate);
		this.lastUpdate = now;
		return delta;
	}

	/** Get the current value of the bucket */
	get() {
		const drain = this.drainRate * this.markDelta();
		if (drain === 0) return this.value;

		this.value = zero(this.value - drain);
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

	/** Check if the `amount` can fit in the bucket, negative values are ignored */
	canFill(amount = 1) {
		return this.get() + zero(amount) <= this.limit;
	}

	/** Attempt to fill the bucket with `amount`, returns success */
	tryFill(amount = 1) {
		if (!this.canFill(amount)) return false;
		this.value += amount; // canFill already updated the value
		return true;
	}

	/** Attempt to fill the bucket with `amount`, throw otherwise */
	fillOrKill(amount = 1) {
		if (this.tryFill(amount)) return this;
		throw `cannot fill ${amount} into bucket with limit ${this.limit})`;
	}

	/** Drain the bucket by `amount` */
	drain(amount = 1) {
		this.set(this.get() - amount);
	}

	/** Calculate the time (in seconds) to drain `amount` */
	timeToDrain(amount = 1) {
		return zero(amount / this.drainRate);
	}

	/** Calculate the time (in seconds) until `amount` will fit in the bucket */
	timeUntilCanFill(amount = 1) {
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
