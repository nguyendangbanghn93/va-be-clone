#!/bin/bash
echo "sleeping for 10 seconds"
sleep 10

echo mongo_setup.sh time now: `date +"%T" `
mongo --host 192.168.8.71:27019 <<EOF
  var cfg = {
    "_id": "rs0",
    "version": 1,
    "members": [
      {
        "_id": 0,
        "host": "192.168.8.71:27019",
        "priority": 2
      },
      {
        "_id": 1,
        "host": "192.168.8.71:27022",
        "priority": 0
      },
      {
        "_id": 2,
        "host": "192.168.8.71:27023",
        "priority": 0
      }
    ]
  };
rs.initiate(cfg, { force: true });
rs.secondaryOk();
db.getMongo().setReadPref('primary');
rs.status();
EOF