-- bucket.moon
-- SFZILabs 2021

updater = (fn) ->
	(...) =>
		@update!
		fn @, ...

class Bucket
	new: (@Limit, Value = 0, @Drain = 1) =>
		assert @Limit, 'Bucket must have a limit!'
		@reset Value

	now: =>
		if game
			tick!
		else os.time!

	update: =>
		Now = @now!
		Delta = Now - @Last
		@Value = math.max 0, @Value - Delta*@Drain
		@Last = Now
		@Value, @Limit - @Value

	fill: updater (Amount = 1) =>
		@Value += Amount
		@Value < @Limit

	try: (Amount = 1) =>
		if @canFill Amount
			@fill Amount
			true
		else false

	canFill: updater (Amount = 1) =>
		@Value + Amount <= @Limit, @Limit - (@Value + Amount)

	reset: (To = 0) =>
		@Value = To
		@Last = 0
