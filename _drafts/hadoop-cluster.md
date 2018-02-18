master: 172.31.25.109
worker1: 172.31.29.222
worker2: 172.31.28.133
worker3: 172.31.31.187

34.216.129.116
52.41.5.48
54.245.171.158

cd apps
mv hadoop hadoop-3.0
mv ../downloads/hadoop hadoop


sudo mkdir -p $HADOOP_HOME/hdfs/data
sudo chown -R ubuntu:ubuntu $HADOOP_HOME/hdfs/data


Host master
  HostName 172.31.25.109
  User ubuntu
  IdentityFile ~/.ssh/id_rsa

Host worker1
  HostName 172.31.29.222
  User ubuntu
  IdentityFile ~/.ssh/id_rsa

Host worker2
  HostName 172.31.28.133
  User ubuntu
  IdentityFile ~/.ssh/id_rsa

Host worker3
  HostName 172.31.31.187
  User ubuntu
  IdentityFile ~/.ssh/id_rsa


<configuration>
  <property>
    <name>dfs.replication</name>
    <value>3</value>
  </property>
  <property>
    <name>dfs.namenode.name.dir</name>
    <value>file:///home/ubuntu/apps/hadoop/hdfs/data</value>
  </property>
</configuration>

<configuration>
  <property>
    <name>mapreduce.jobtracker.address</name>
    <value>172.31.25.109:54311</value>
  </property>
  <property>
    <name>mapreduce.framework.name</name>
    <value>yarn</value>
  </property>
</configuration>


<configuration>

  <!-- Site specific YARN configuration properties -->
  <property>
    <name>yarn.nodemanager.aux-services</name>
    <value>mapreduce_shuffle</value>
  </property>
  <property>
    <name>yarn.nodemanager.aux-services.mapreduce.shuffle.class</name>
    <value>org.apache.hadoop.mapred.ShuffleHandler</value>
  </property>
  <property>
    <name>yarn.resourcemanager.hostname</name>
    <value>172.31.25.109</value>
  </property>

</configuration>

cd $HADOOP_HOME
vim etc/hadoop/hdfs-site.xml
---
<configuration>
  <property>
    <name>dfs.replication</name>
    <value>3</value>
  </property>
  <property>
    <name>dfs.datanode.data.dir</name>
    <value>file:///home/ubuntu/apps/hadoop/hdfs/data</value>
  </property>
</configuration>
