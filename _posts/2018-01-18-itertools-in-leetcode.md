---
layout: single
title: "Use `intertools` to solve combination and permutation problems in leetcode"
date: 2018-01-17 09:00:00
toc: true
---

In python, package [`itertools`](https://docs.python.org/3/library/itertools.html)  is a very powerful and efficient looping tool. Here are some examples of how to solve some leetcode algorithm problems using this tool.

# Quick Look at [Combinatoric Iterators](https://docs.python.org/3/library/itertools.html#itertools.combinations)

| Iterator                                 | Arguments          | Results                                  |
| ---------------------------------------- | ------------------ | ---------------------------------------- |
| [`product()`](https://docs.python.org/3/library/itertools.html#itertools.product) | p, q, … [repeat=1] | cartesian product, equivalent to a nested for-loop |
| [`permutations()`](https://docs.python.org/3/library/itertools.html#itertools.permutations) | p[, r]             | r-length tuples, all possible orderings, no repeated elements |
| [`combinations()`](https://docs.python.org/3/library/itertools.html#itertools.combinations) | p, r               | r-length tuples, in sorted order, no repeated elements |
| [`combinations_with_replacement()`](https://docs.python.org/3/library/itertools.html#itertools.combinations_with_replacement) | p, r               | r-length tuples, in sorted order, with repeated elements |
| `product('ABCD', repeat=2)`              |                    | `AA AB AC AD BA BB BC BD CA CB CC CD DA DB DC DD` |
| `permutations('ABCD', 2)`                |                    | `AB AC AD BA BC BD CA CB CD DA DB DC`    |
| `combinations('ABCD', 2)`                |                    | `AB AC AD BC BD CD`                      |
| `combinations_with_replacement('ABCD', 2)` |                    | `AA AB AC AD BB BC BD CC CD DD`          |

# LeetCode Problems and Solutions

## [Combinations](https://leetcode.com/problems/combinations/description/)

### Description

Given two integers *n* and *k*, return all possible combinations of *k* numbers out of 1 ... *n*.

For example,
If *n* = 4 and *k* = 2, a solution is:

```
[
  [2,4],
  [3,4],
  [2,3],
  [1,2],
  [1,3],
  [1,4],
]
```

### Solution

It likes talored for the `itertools.combinations()` function. :laughing:

```python
import itertools

class Solution:
    def combine(self, n, k):
        """
        :type n: int
        :type k: int
        :rtype: List[List[int]]
        """
        nums = [x for x in range(1, n+1)]
        return list(itertools.combinations(nums, k))
```

## [Combination Sum III](https://leetcode.com/problems/combination-sum-iii/description/)

### Description

Find all possible combinations of **\*k*** numbers that add up to a number **\*n***, given that only numbers from 1 to 9 can be used and each combination should be a unique set of numbers.

**\*Example 1:***

Input:  ***k*** = 3,  ***n*** = 7

Output: 

```
[[1,2,4]]
```

**\*Example 2:***

Input:  ***k*** = 3,  ***n*** = 9

Output: 

```
[[1,2,6], [1,3,5], [2,3,4]]
```

### Solution

```python
import itertools

class Solution:
    def combinationSum3(self, k, n):
        """
        :type k: int
        :type n: int
        :rtype: List[List[int]]
        """
        if n < 1 or n > (1 + 9) * 9 / 2: return [] # n is too small or big
        nums = [x for x in range(1, 10)] # form a list of numbers from 1 to 10 (exclusive)
        return [e for e in itertools.combinations(nums, k) if sum(e) == n] # comprehension
```

### Note

`return list(e for e in itertools.combinations(nums, k) if sum(e) == n)` will also work but it is a little bit slow that the list comprehension which is used in the provided solution.

## [Permutations](https://leetcode.com/problems/permutations/description/)

### Description

Given a collection of **distinct** numbers, return all possible permutations.

For example,
`[1,2,3]` have the following permutations:

```
[
  [1,2,3],
  [1,3,2],
  [2,1,3],
  [2,3,1],
  [3,1,2],
  [3,2,1]
]
```

### Solution

```python
import itertools

class Solution:
    def permute(self, nums):
        """
        :type nums: List[int]
        :rtype: List[List[int]]
        """
        return list(itertools.permutations(nums))
```

## Permutations II

### Description

Given a collection of numbers that might contain duplicates, return all possible unique permutations.

For example,
`[1,1,2]` have the following unique permutations:

```
[
  [1,1,2],
  [1,2,1],
  [2,1,1]
]
```

### Solution

```python
import itertools

class Solution:
    def permuteUnique(self, nums):
        """
        :type nums: List[int]
        :rtype: List[List[int]]
        """
        return list(set(itertools.permutations(nums))) # get rid of duplicates
```



# Limitation

The built-in function is very handy and cool. However, it is always slow to search all the combinations/permutations in a list of numbers. That's where other algorithms like backtracking come in because it can prune the unnecessary branches when searching. Later, I will introduce the solution to these questions as well.

[Combination Sum](https://leetcode.com/problems/combination-sum)    

[Combination Sum II](https://leetcode.com/problems/combination-sum-ii)  

[Combination Sum IV](https://leetcode.com/problems/combination-sum-iv) 






2018-01-18, Seattle