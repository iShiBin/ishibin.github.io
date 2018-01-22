---
layout: single
title: "Get timestamp in millisecond in python 2"
date: 2018-01-21 19:05:00
---

Just a quick code snippet to get the millisecond in python.
```python
# python 2.x
import time
import calendar

# to get the time stamp in 1. millisecond (Linux stype from the epoch 1970-01-01 00:00:00)

dt = time.strptime('1970-01-02', '%Y-%m-%d')
print(dt)

ts = calendar.timegm(dt)
print(ts * 1000)
```


2018-01-21, Seattle
