# **Mongo Query Parse Filter**

Lightweight package that allows you to easily convert complex, human-readable query filters into MongoDB-compatible query syntax, supporting logical operations like `AND`, `OR`, `NOT`, `IN`, `NIN` and various comparison operators


-----

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Example](#example)


-----

## Installation


To install the package, use npm:

```bash
npm i mongo-query-parse-filter
```

## Usage

```javascript
const { MongoQuery } = require('mongo-query-parse-filter');

const mongoQuery = new MongoQuery();

const query = mongoQuery.buildQuery('(email eq "jhon@example.com")')

console.log(query)

```
#### Result

```json
{
    "email": { "$eq": "jhon@example.com" }
}
```

## Example

#### eq,neq,gt,gte,lt,lte,regex: `(email regex "(?i)@example.com$")`

```json
{
    "email": { "$regex": "(?i)@example.com$" }
}
```

#### OR/AND: `(email eq "jhon@example.com") or (username eq "alice")`
```json
{
    "$or": [
        {
            "email": { "$eq": "jhon@example.com" }
        },
        {
            "username": { "$eq": "alice" }
        }
    ]
}
```

#### NOT: `(not ((department eq "Marketing") or (department eq "Sales")))`

to find all employees who are not either in the Marketing or Sales departments

```json
{
    "$not": {
        "$or": [
            {
                "department": { "$eq": "Marketing" }
            },
            {
                "department": { "$eq": "Sales" }
            }
        ]
    }
}
```

#### IN/NIN: `(email in "'alice@example.com','jhon@example.com'")`

```json
{
    "email": { "$in": [ "alice@example.com", "jhon@example.com"] }
}
```