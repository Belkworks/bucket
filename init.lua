local updater
updater = function(fn)
  return function(self, ...)
    self:update()
    return fn(self, ...)
  end
end
local Bucket
do
  local _class_0
  local _base_0 = {
    now = function(self)
      if game then
        return tick()
      else
        return os.time()
      end
    end,
    update = function(self)
      local Now = self:now()
      local Delta = Now - self.Last
      self.Value = math.max(0, self.Value - Delta * self.Drain)
      self.Last = Now
      return self.Value
    end,
    fill = updater(function(self, Amount)
      self.Value = self.Value + Amount
      return self.Value < self.Limit
    end),
    canFill = updater(function(self, Amount)
      if Amount == nil then
        Amount = 1
      end
      return self.Value + Amount <= self.Limit
    end),
    reset = function(self, To)
      if To == nil then
        To = 0
      end
      self.Value = To
      self.Last = 0
    end
  }
  _base_0.__index = _base_0
  _class_0 = setmetatable({
    __init = function(self, Limit, Value, Drain)
      if Value == nil then
        Value = 0
      end
      if Drain == nil then
        Drain = 1
      end
      self.Limit, self.Drain = Limit, Drain
      assert(self.Limit, 'Bucket must have a limit!')
      return self:reset(Value)
    end,
    __base = _base_0,
    __name = "Bucket"
  }, {
    __index = _base_0,
    __call = function(cls, ...)
      local _self_0 = setmetatable({}, _base_0)
      cls.__init(_self_0, ...)
      return _self_0
    end
  })
  _base_0.__class = _class_0
  Bucket = _class_0
  return _class_0
end
