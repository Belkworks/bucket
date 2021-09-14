# Bucket
*A leaky bucket for managing limitations.*

**Importing with [Neon](https://github.com/Belkworks/NEON)**:
```lua
Bucket = NEON:github('belkworks', 'bucket')
```

## API

To create a **Bucket** instance, call `Bucket`.  
**Bucket**: `Bucket(limit, value = 0, drain = 1) -> Bucket`  
`drain` is the amount amount removed from the bucket **per second**.  
`limit` is the maximum the bucket can hold.  
`value` is the starting value.
```lua
bucket = Bucket(10)
```

### Filling the Bucket

To fill a bucket, use the **fill** method.  
**fill**: `bucket:fill(amount = 1) -> boolean`  
Adds `amount` to the bucket.  
Returns ***false*** if the bucket is now full.  
**NOTE**: This method allows overfilling the bucket (see **try**)
```lua
bucket:fill(1) -- true
bucket:fill(10) -- false
```

**try**: `bucket:try(amount = 1) -> boolean`  
Attempts to fill the bucket with `amount`.  
Returns ***false*** if the bucket cannot hold `amount`.
```lua
-- Bucket value is 0
bucket:try(20) -- false
bucket:try(5) -- true
```

### Querying the Bucket

**canFill**: `bucket:canFill(amount = 1) -> boolean, number`  
Checks if the bucket can hold `amount`.  
Returns ***false*** if the bucket cannot hold `amount`.  
Also returns the hypothetical remaining space if the fill was executed.
```lua
-- Bucket value is 0
bucket:canFill(1) -- true, 9
bucket:canFill(10) -- true, 0
```

### Managing the Bucket

While the value is managed for you, you may wish to manually update or view the current value of the bucket. To do so, call **update**.  
**update**: `bucket:update() -> number, number`  
Updates the bucket's value.  
Returns the current value and the remaining space as a tuple.
```lua
-- Bucket value is 0
bucket:update() -- 0, 10
```

To view the value of a bucket without updating it, you can index the `Value` property.
```lua
bucket.Value -- 0
```

You can remove value from the bucket with **drain**.  
**drain**: `bucket:drain(amount = 1) -> number`  
Removes `amount` from the bucket's value.  
Returns the new value.
```lua
-- Bucket value is 2
bucket:drain(1) -- 1
```

You can reset the bucket with **reset**.  
**reset**: `bucket:reset(value = 0) -> nil`  
Sets the bucket's value to `value`.
```lua
bucket:reset() -- value is now zero
```
