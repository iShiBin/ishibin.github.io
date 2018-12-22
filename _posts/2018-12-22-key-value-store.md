---
layout: single
title: "Versioned Key-Value Store" 
date: 2018-12-22 15:22:00 -08:00
header:
teaser: "https://www.kdnuggets.com/wp-content/uploads/key-value.png"
toc: true
categories:
  - algorithm
tags:
  - map
---

**Versioned Key-Value Store**

   You are to build a simple key-value store for storing integers (keys are strings, values are integers)
   and a **global** version (integer). You will not persist data to disk. You will store the data in memory.

   The version number is an integer that increases monotonically. Every time any key is written with a value, 
   the version number is increased. The first write is version number 1. The second write is version number 2, and so on.

   The store supports three operations. The first is PUT, which returns the version number of this write. 
   The second operation is the simple GET. This returns the last value mapped to the key.
   The third operation is the versioned GET. This takes a key and a number. Assume that all inputs are case sensitive.

The input contains three types of commands corresponding to the three operations supported by the store:

- PUT <key> <value>
  Set the key name to the value. Key strings will not contains spaces. Print out the version number, 
  the key and the value as PUT(#<version number>) <key> = <value>. 
  The first write in the file should be version 1, and the second should be version number 2, etc.

- GET <key>
  Print out the key and the last value of the key, or <NULL> if that key has never been set as in: GET <key> = <value>

- GET <key> <version number>
  Print out the key, the version number and the value of key as it was at the time of the version number, 
  or <NULL> if that key was not set at that time, as in GET <key>(#version) = <value>.
  If the version number has not yet been recorded, return the most recent value for the key. 
  See below for examples of formatted output.

  >*Sample Input*  
   PUT key1 5  
   PUT key2 6  
   GET key1  
   GET key1 1  
   GET key2 2  
   PUT key1 7  
   GET key1 1  
   GET key1 2  
   GET key1 3  
   GET key4  
   GET key1 4  

  >*Sample Output*  
   PUT(#1) key1 = 5  
   PUT(#2) key2 = 6  
   GET key1 = 5  
   GET key1(#1) = 5  
   GET key2(#2) = 6  
   PUT(#3) key1 = 7  
   GET key1(#1) = 5  
   GET key1(#2) = 5  
   GET key1(#3) = 7  
   GET key4 = <NULL>  
   GET key1(#4) = 7  

---

```python
import fileinput
from bisect import bisect
import fileinput

class KVStore(object):
    """
    - reduce the GET time complexity by using bisect to query the stored versions (sorted list)
    - deal with edge cases and error handling
    """
    # PUT O(1), O(n)
    # GET O(log(n)), O(n)

    g_version = 0

    def __init__(self):
        self.store = {} # {key: {verion:value}}
        self.versions = {}
    
    def put(self, key, value):
        KVStore.g_version += 1
        if not key in self.store:
            self.store[key] = {}
            self.versions[key] = [] 
        self.store[key][KVStore.g_version] = value
        self.versions[key].append(KVStore.g_version)
        output = f'PUT(#{KVStore.g_version}) {key} = {value}'
        
        print(output)
        return output

    def get(self, key, version = None): # assume verison is >= 1
        output = None
        if not key in self.store:
            output = f'GET {key} = <NULL>'
        elif not version:
            max_version = self.versions[key][-1]
            value = self.store[key][max_version]
            output = f'GET {key} = {value}'
        elif version in self.versions[key]:
            value = self.store[key][version]
            output = f'GET {key}(#{version}) = {value}'
        elif version >= 1:
            le_index = bisect(self.versions[key], version)
            le_version = self.versions[key][le_index - 1]
            value = self.store[key][le_version]
            output = f'GET {key}(#{version}) = {value}'
        else: # invalid version number
            raise ValueError
        
        print(output)
        return output

    def build(self, input_file):
        with fileinput.input(files=(input_file)) as input:
            for line in input:
                commands = line.strip().split()
                if commands[0].upper() == 'PUT':
                    self.put(commands[1], commands[2])
                elif commands[0].upper() == 'GET':
                    self.get(commands[1], int(commands[2]) if len(commands) > 2 else None)
                else:
                    raise ValueError 


if __name__ == "__main__":
    store = KVStore()
    store.build('./input.txt')

```
