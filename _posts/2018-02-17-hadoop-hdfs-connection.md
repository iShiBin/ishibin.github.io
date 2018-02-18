---
title: "Troubleshoot Failed on Connecting to HDFS Exception"
date: 2018-02-17 20:34:00 -08:00
header:
teaser: "http://www.crackinghadoop.com/wp-content/uploads/2016/08/hadoop-hdfs-300x200.jpg"
toc: true
categories:
  - big-data
tags:
  - hadoop
---

# Error Message

ubuntu@ip-172-31-43-69:~/apps/hadoop$ hadoop fs -ls /
ls: Call From ip-172-31-43-69.us-west-2.compute.internal/172.31.43.69 to localhost:9000 failed on connection exception: java.net.ConnectException: Connection refused; For more details see:  http://wiki.apache.org/hadoop/ConnectionRefused

# Expected

`hadoop fs -ls /` can list all the folders and files under `/` in the HDFS

# Context

It happens every time after rebooting EC2 hosting Hadoop 3.0.0

# Workaround

Format the filesystem:
$ bin/hdfs namenode -format

Start NameNode daemon and DataNode daemon:
$ sbin/start-dfs.sh

The hadoop daemon log output is written to the `HADOOP_LOG_DIR directory (defaults to $HADOOP_HOME/logs)`
Browse the web interface for the NameNode; by default it is available at:
NameNode - http://localhost:50070/

Make the HDFS directories required to execute MapReduce jobs:

```
$hadoop fs -mkdir /user
$hadoop fs -mkdir /user/[username]
```

Note: the [username] is should be replaced by actual name like 'ubuntu' 'ec2-user' etc.

# Root Cause

When EC2 reboots, temp files in the system's temp folder may be cleaned, which leads to the HDFS cannot startup correctly.

# Solution

1. create a new temp folder (supposing /home/ubuntu/apps/hadoop/tmp)
2. add the `hadoop.tmp.dir` property in the core-site.xml file (located under etc/hadoop in the $HADOOP_ROOT) 
3. format the HDFS
4. restart hadoop

Note: The <configuration> section will look like the following after the fix.
```xml
<configuration>
    <property>
        <name>fs.defaultFS</name>
		<value>hdfs://localhost:9000</value>
    </property>
    <property>
      	<name>hadoop.tmp.dir</name>
      	<value>/home/ubuntu/apps/hadoop/tmp</value>
    </property>
</configuration>
```