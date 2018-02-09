---
title: "Understand Idempotence of Reduce Function in MongoDB"
date: 2018-02-03 22:32:00 -08:00
header:
teaser: "https://www.todobackend.com/images/logos/mongodb.png"
toc: true
categories:
  - database
tags:
  - mongodb
---

Here are the characteristics of **[Reduce Function Idempotence](https://docs.mongodb.com/manual/tutorial/troubleshoot-reduce-function/#ensure-reduce-function-idempotence)**:

- a map-reduce operation may call a `reduce` multiple times for the same key
- it won’t call a `reduce` for single instances of a key in the working set
- the `reduce` function must return a value of the same type as the value emitted from the `map` function.

## Problem: Calculate Average Price Using MapReduce

### Description

Find the **average** price of `stock_price_high` values for each stock and the total average price for all the stock using map-reduce in MongoDB.

### Dataset

The dataset comes from http://msis.neu.edu/nyse, and it has more than 9 million stock price records. After importing them to MongoDB database using `mongdoimport` command, the data format is like below.

```json
> use nysedb;
> db.stocks.count()
9211031
> db.stocks.findOne();
{
    "_id" : ObjectId("5a7158a80cf8a8197ba29570"),
    "exchange" : "NYSE",
    "stock_symbol" : "AEA",
    "date" : "2010-02-08",
    "stock_price_open" : 4.42,
    "stock_price_high" : 4.42,
    "stock_price_low" : 4.21,
    "stock_price_close" : 4.24,
    "stock_volume" : 205500,
    "stock_price_adj_close" : 4.24
}
```

Note: The collection name is 'stocks'. And here is the bash script to import this dataset.

```bash
!/bin/bash
FILES=NYSE/NYSE_daily_prices_*.csv
for f in $FILES
do
    echo "Processing $f file..."
    # ls -l $f
    mongoimport --db nysedb --collection stocks --type csv --headerline --file $f
done
```

## Sub-Problem: Calculate the Average Price for Each Stock

Let's take the `stock_price_high`property as an example to calculate the average.

### Approach I:  MapReduce using `forEach()`

```javascript
let map = function () {
    emit(this.stock_symbol, this.stock_price_high);
}

let reduce = function (key, values) {
  sum = 0;
  num = 0;
  
  values.forEach(function (v) {
    sum += v;
    num += 1;
  });
  
  if (num > 0){
    return sum / num;
  } else {
    return 0;
  };
}

db.stocks.mapReduce(map, reduce, {out:"mr_stock_price_avg_each"})
```

This job runs successfully with 9211031 inputs and 2853 outputs. And here is the result of "AA".

> { "_id" : "AA", "value" : 64.26173484209001 }

The function looks quite straightforward. Now let's use another short version and cross-validated.

###  Approach II: MapReduce using `Array.sum()`

```json
let map = function () {
    emit(this.stock_symbol, this.stock_price_high);
}

let reduce = function (key, values) {
  sum = Array.sum(values);
  num = values.length;
}

db.stocks.mapReduce(map, reduce, {out:"mr_stock_price_avg_each"})
```

 Again, here is the result of "AA".

> { "_id" : "AA", "value" : 64.26173484209001 }

### Validation using NoSQL Aggregate

The value seems matching the previous approach. How could it be wrong? However, you will be surprised when you run this NoSQL aggregate to calculate the same average value for stock "AA".

```json
> db.stocks.aggregate(
   [
     {
       $match: {stock_symbol: "AA"}
     },
     {
       $group:
         {
           _id: "$stock_symbol",
           avgAmount: { $avg: "$stock_price_high" }
         }
     }
   ]
)
```

However, the output is `52.45968205467008`, which is different. Now, which one is right?

Since the stock "AA"'s records are all in file NYSE_daily_prices_A.csv, use Excel can easily calculate the average, which is also `52.45968205`. So it must be the right value. (Consider they are 52.45968205 since precision after the 7th of . does not matter much in this case.)

### Explanation and Fix

Here is the code to fix the bug.

```javascript
let map = function () {
    emit(this.stock_symbol, {"price":this.stock_price_high, "count":1});
}

let reduce = function (key, values) {
  reducedVal = {price: 0, count: 0}
  
  values.forEach(function(v){
    reducedVal.price += v.price;
    reducedVal.count += v.count;
  });
  
  return reducedVal;
}

let average = function (key, reducedValue) {
  return reducedValue.price / reducedValue.count;
}

db.stocks.mapReduce(map, reduce, {out:"mr_stock_price_avg_each_fix", finalize:average})
```

### But WHY?

Go back and check [Requirements for the `reduce` Function](https://docs.mongodb.com/manual/reference/command/mapReduce/#requirements-for-the-reduce-function), notice this requirement:

> Because it is possible to invoke the `reduce` function more than once for the same key, the following properties need to be true:
>
> - the *type* of the return object must be **identical** to the type of the `value` emitted by the `map`function.
>
> - the `reduce` function must be *associative*. The following statement must be true:

```
reduce(key, [ C, reduce(key, [ A, B ]) ] ) == reduce( key, [ C, A, B ] )
```

However, [average operation is not associative](http://www.dcs.ed.ac.uk/home/mhe/plume/node35.html). so it could not be in the reduce method.

For example, considering stock "AA" with prices [1, 2, 6], the correct average should be 3. However, if the reduce job somehow is called twice, the first of which has input [1, 2], then the average is 1.5. Then the second call of [1.5, 6] gets 3.75 as the average, which is wrong. (Number 1.5 is the result of first reduce output.) It looks like below if you put it in the formula.

> average("AA", [6, average ("AA", [1, 2])]) ≠ average ("AA", [6, 1, 2])

So, it has to use a finalize method, which manipulates the result of the reduce job after it finishes.

## Sub-Problem: Calculate the Average Price for All Stocks

### Approach

Reuse and modified the solution of the previous sub-problem. Here is the algorithm.

1. Have global variable sumAll to store the running sum for every occurrence of a stock
2. Counter the number of prices, and store in the countAll
3. Return a list [avgEach, avgAll] in the finalizer

```javascript
let map = function () {
    emit(this.stock_symbol, {"price":this.stock_price_high, "count":1});
}

let reduce = function (key, values) {
  reducedVal = {price: 0, count: 0}
  
  values.forEach(function(v){
    reducedVal.price += v.price;
    reducedVal.count += v.count;
    
    sumAll += v.price;
    countAll += v.count;
  });
  
  return reducedVal;
}

let avgAll = function (key, reducedValue) {
  return { avg: reducedValue.price / reducedValue.count, allAvg: sumAll/countAll }
}
db.stocks.mapReduce(map, reduce, {out:"mr_stock_price_avg_all", scope:{sumAll:0, countAll:0},finalize:avgAll})
```
Let's check the output value of "AA":

```json
{ "_id" : "AA", "value" : { "avg" : 52.459682054670246, "allAvg" : 32.96151152346334 } }
```

Then validate this result using aggregation in mongo shell.

```json
> db.stocks.aggregate(
   [
     {
       $group:{
         _id: null,
         averageHighPrice: { $avg: "$stock_price_high" }
       }
     }
   ]
)
{ "_id" : null, "averageHighPrice" : 29.0213587773182 }
```

What? Mismatch again!

### But WHY?

**Because the MongoDB engine [won’t call a `reduce` for single instances of a key](https://docs.mongodb.com/manual/reference/command/mapReduce/#requirements-for-the-reduce-function) in the working set.**

To fix this problem, simply calculate the running sum and counts in the `map` function, because every record will be mapped no matter what.

So here is the corrected solution.

```json
let map = function () {
    sumAll += this.stock_price_high;
    countAll += 1
    emit(this.stock_symbol, {"price":this.stock_price_high, "count":1});
}

let reduce = function (key, values) {
  reducedVal = {price: 0, count: 0}
  
  values.forEach(function(v){
    reducedVal.price += v.price;
    reducedVal.count += v.count;
  });
  
  return reducedVal;
}

let avgAll = function (key, reducedValue) {
  return { avg: reducedValue.price / reducedValue.count, allAvg: sumAll/countAll }
}
db.stocks.mapReduce(map, reduce, {out:"mr_stock_price_avg_all", scope:{sumAll:0, countAll:0},finalize:avgAll})
```

## Summary

When using the map-reduce, it is essential to follow [the requirement](https://docs.mongodb.com/manual/reference/command/mapReduce/#requirements-for-the-reduce-function) of `reduce function` as below. Any violation may lead to incorrect result.

- MongoDB will **not** call the `reduce` function for a key that has only a single value. The `values`argument is an array whose elements are the `value` objects that are “mapped” to the `key`.
- MongoDB can invoke the `reduce` function more than once for the same key. In this case, the previous output from the `reduce` function for that key will become one of the input values to the next `reduce` function invocation for that key.
- The `reduce` function can access the variables defined in the `scope` parameter.