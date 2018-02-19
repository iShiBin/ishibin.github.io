---
title: "BigQuery using Python and SQL"
date: 2018-02-19 08:34:00 -08:00
header:
# teaser: "http://www.crackinghadoop.com/wp-content/uploads/2016/08/hadoop-hdfs-300x200.jpg"
toc: true
categories:
  - big-data
tags:
  - BigQuery
---
Here is the basic steps to use SQL and Python in BigQuery.

Step 1:
```python
# import package with helper functions
import bq_helper

# create a helper object for this dataset
accidents = bq_helper.BigQueryHelper(active_project="bigquery-public-data",
                                   dataset_name="nhtsa_traffic_fatalities")
```

Step 2:

```sql
-- query to find out the number of accidents which
-- happen on each day of the week
query = """SELECT COUNT(consecutive_number),
                  EXTRACT(DAYOFWEEK FROM timestamp_of_crash)
            FROM `bigquery-public-data.nhtsa_traffic_fatalities.accident_2015`
            GROUP BY EXTRACT(DAYOFWEEK FROM timestamp_of_crash)
            ORDER BY COUNT(consecutive_number) DESC
        """
```

Step 3:
```python
# the query_to_pandas_safe method will cancel the query if
# it would use too much of your quota, with the limit set
# to 1 GB by default
accidents_by_day = accidents.query_to_pandas_safe(query)
# accidents_by_day = accidents.query_to_pandas_safe(query, max_gb_scanned=6) # 6G Memory
```

Step extra:
```python
# library for plotting
import matplotlib.pyplot as plt

# make a plot to show that our data is, actually, sorted:
plt.plot(accidents_by_day.f0_)
plt.title("Number of Accidents by Rank of Day \n (Most to least dangerous)")
```
Note: The source code comes from my [SQL Scavenger Hunt: Day 3](https://www.kaggle.com/binshi/sql-scavenger-hunt-day-3)
