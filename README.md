# Bucket

_A leaky bucket class for rate limiting._

## Documentation

https://belkworks.github.io/bucket

## Example

### Typescript

```ts
import { Bucket } from "@belkworks/bucket";

// Create a Bucket with a limit of 10
const bucket = new Bucket(10);

// Add 10 to the bucket
bucket.fill(10);

print(bucket.canFill(1)); // false
print(bucket.tryFill(1)); // false
print(bucket.timeUntilCanFull(1)); // 1
```

### Luau

```lua
local Bucket = require(path.to.bucket)

-- Create a Bucket with a limit of 10
local bucket = Bucket.new(10)

-- Add 10 to the bucket
bucket:fill(10)

print(bucket:canFill(1)) -- false
print(bucket:tryFill(1)) -- false
print(bucket:timeUntilCanFull(1)) -- 1
```
