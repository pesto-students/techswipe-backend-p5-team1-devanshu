## Message Architecture

- message schema would be

    ```
    fromUserId: number
    toUserId: number
    message: String,
    timestamp: String,
    read:boolean
    ```

    - Post message End point 
    ```js
    Method:POST 
    url: /api/v1/message
    body
    {
        fromUserId:2,
        toUserId:1,
        message:"hi how are you"
    }
    ```
- Get endpoint message with pagination & limit of 10 messages with page number 1 to last , need to get the messages from the last

    ```js
    Method:GET
    url: /api/v1/message?limit=10
    params:{
        fromUserId:2,
        toUserId:1 
    }
    ```
    - update message 

    ```js
    Method:PUT
    url: /api/v1/message
    params:{
        fromUserId:2,
        toUserId:1 
    }
    ```

- All messages list with latest user on top with the message show with out opening
```js
 Method:PUT
    url: /api/v1/message
    params:{
        fromUserId:2,
    }
```

- from user obj {name,profileUrl}
- to user obj {name,profileUrl}
- 


## Required for Frontend:
- Needs text, timestamp, user1 & user 2 details , message read boolean
- list of latest messages with him (Pagination)
- list of messages b/w two users (Pagination)