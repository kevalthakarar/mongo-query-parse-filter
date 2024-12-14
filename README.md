# mongo-query-parse-filter


(email eq "keval@leena.ai")

{
    "email" : { "$eq" : "keval@leena.ai"}
}

(email eq "keval@leena.ai") and (userName eq "keval")
{
    "op": "and",
    "filter": [
        {
            "op": "eq",
            "attrPath": "email",
            "comparisionValue": "keval@leena.ai"
        },
        {
            "op": "eq",
            "attrPath": "userName",
            "comparisionValue": "keval"
        }
    ]
}

{
    $and: [
        {
            email : "keval@leena.ai"
        },
        {
            userName : "keval"
        }
    ]
}



(not ((age gt "30") or (status eq "active")))

{
    "op": "not",
    "filter": {
        "op": "or",
        "filter": [
            {
                "op": "gt",
                "attrPath": "age",
                "comparisionValue": "30"
            },
            {
                "op": "eq",
                "attrPath": "status",
                "comparisionValue": "active"
            }
        ]
    }
}

{
  $not: {
    $or: [
      { age: { $gt: 30 } },    // Age greater than 30
      { status: { $eq: "active" } }  // Status is "active"
    ]
  }
}