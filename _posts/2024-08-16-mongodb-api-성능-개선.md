---
author: jeongcool
categories: database
date: '2024-08-16'
layout: post
tags:
- mongodb
- performance
- index
title: "mongodb 실행계획 분석 및 인덱스로 API 성능 개선"
---
# 문제의 쿼리

홈넷기기 조회 API의 경우 아래와 같은 쿼리를 발생한다.

```json
{"$and": [{"siteId": "?"}, {"dong": "?"}, {"ho": "?"}]}
{"$and": [{"siteId": "?"}, {"dong": "?"}, {"ho": "?"}, {"homenetDeviceType": {"$in": ["?"]}}]}
```

해당 쿼리에 대한 쿼리 실행계획을 살펴보면 다음과 같은데

```json
[
  {
    "$clusterTime": {
      "clusterTime": {"$timestamp": {"t": 1718106165, "i": 206}},
      "signature": {
        "hash": {"$binary": {"base64": "/vOTVcUrRwtKwiymlqp/Wso668U=", "subType": "00"}},
        "keyId": 7345942995985760314
      }
    },
    "command": {
      "find": "마스킹",
      "filter": {
        "$and": [
          {"siteId": "마스킹"},
          {"dong": "101"},
          {"ho": "1501"}
        ]
      },
      "$db": "마스킹"
    },
    "explainVersion": "1",
    "ok": 1,
    "operationTime": {"$timestamp": {"t": 1718106165, "i": 206}},
    "queryPlanner": {
      "namespace": "마스킹",
      "indexFilterSet": false,
      "parsedQuery": {
        "$and": [
          {"dong": {"$eq": "101"}},
          {"ho": {"$eq": "1501"}},
          {"siteId": {"$eq": "마스킹"}}
        ]
      },
      "queryHash": "13E45E70",
      "planCacheKey": "B1D0A314",
      "maxIndexedOrSolutionsReached": false,
      "maxIndexedAndSolutionsReached": false,
      "maxScansToExplodeReached": false,
      "winningPlan": {
        "stage": "COLLSCAN",
        "filter": {
          "$and": [
            {"dong": {"$eq": "101"}},
            {"ho": {"$eq": "1501"}},
            {"siteId": {"$eq": "마스킹"}}
          ]
        },
        "direction": "forward"
      },
      "rejectedPlans": []
    },
    "serverInfo": {
      "host": "atlas-ats1v5-shard-00-02.tps5b.mongodb.net",
      "port": 27017,
      "version": "6.0.15",
      "gitVersion": "7494119c41ca4e13b493e9f048df4032164e860e"
    },
    "serverParameters": {
      "internalQueryFacetBufferSizeBytes": 104857600,
      "internalQueryFacetMaxOutputDocSizeBytes": 104857600,
      "internalLookupStageIntermediateDocumentMaxSizeBytes": 104857600,
      "internalDocumentSourceGroupMaxMemoryBytes": 104857600,
      "internalQueryMaxBlockingSortMemoryUsageBytes": 104857600,
      "internalQueryProhibitBlockingMergeOnMongoS": 0,
      "internalQueryMaxAddToSetBytes": 104857600,
      "internalDocumentSourceSetWindowFieldsMaxMemoryBytes": 104857600
    }
  }
]
```

winningPlan.stage 를 보면 `COLLSCAN` 으로 나와있는데 이는 collection scan을 의미하고 모든 도큐먼트를 스캔하여 쿼리 결과에 맞는 데이터를 조회하는 것을 의미한다.

## 인덱스

siteId, dong, ho이 공통적으로 사용되며 이를 복합 인덱스를 걸어보자

```javascript
db.collection.createIndex({ siteId: 1, dong: 1, ho: 1 })
```

## 개선결과
실제로 3초 이상 걸리는 쿼리를 1초 미만으로 줄였다. (자료는 날라갔네요...)


# 추가로 알아보면 좋을 cusor.explain() 함수는 3가지 모드

## queryPlanner 모드

- Mongodb는 query optimazer를 실행하여 수행할 작업에 대한 winning plan를 선택하고, cusor.explain() 에 대한 평가된 query planner를 반환한다.
- 쿼리를 실제로 수행하지 않는다.
- rejected plan는 반환하지 않는다.

## executionStats 모드

- winning plan를 선택하고, query planner를 수행한 결과에 대한 지표를 반환한다.
- winning plan에 대한 쿼리를 직접 수행하고 결과를 반환한다.
- rejected plan는 반환하지 않는다.

## allPlansExecution 모드

- executionStats모드와 같이 winning plan를 선택하고 query palnner를 수행하여 이에 대한 통계 및 plan selection 중 캡처된 다른 winning plan에 대한 정보도 제공한다.
- winning plan에 대한 쿼리를 직접 수행하고 결과를 반환한다.
- rejected plan에 대한 정보도 제공한다.

# Reference
- [cursor.explain()](https://www.mongodb.com/docs/manual/reference/method/cursor.explain/)
