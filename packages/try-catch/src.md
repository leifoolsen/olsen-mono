[**olsen-mono**](../README.md)

---

## Functions

### tryCatch()

Wrapper to handle both synchronous and asynchronous executions without traditional try/catch blocks.
It imitates the concept of the scala.util.Try monad or the Go programming language’s approach to error handling.

#### Param

A Promise or a (synchronous or async) function to be evaluated.

#### Call Signature

> **tryCatch**\<`T`, `E`\>(`input`): `Result`\<`T`, `E`\>

Defined in: [try-catch/src/try-catch.ts:21](https://github.com/leifoolsen/olsen-mono/blob/1991d5ebaba962cfc3061822e555d919fe96d732/packages/try-catch/src/try-catch.ts#L21)

Synchronously executes a function and captures any thrown errors.
It imitates the concept of the scala.util.Try monad or the Go programming language’s approach to error handling.

##### Type Parameters

###### T

`T`

###### E

`E` = `Error`

##### Parameters

###### input

() => `T`

A synchronous function to execute.

##### Returns

`Result`\<`T`, `E`\>

A [Result] tuple containing `[undefined, data]` on success or `[error]` on failure.
Error first encourages error handling. Returning a tuple makes renaming
error and data easier, especially useful if you call it many times.

#### Call Signature

> **tryCatch**\<`T`, `E`\>(`input`): `PromiseLike`\<`Result`\<`T`, `E`\>\>

Defined in: [try-catch/src/try-catch.ts:32](https://github.com/leifoolsen/olsen-mono/blob/1991d5ebaba962cfc3061822e555d919fe96d732/packages/try-catch/src/try-catch.ts#L32)

Asynchronously handles a Promise or a function returning a Promise.
It imitates the concept of the scala.util.Try monad or the Go programming language’s approach to error handling.

##### Type Parameters

###### T

`T`

###### E

`E` = `Error`

##### Parameters

###### input

`PromiseLike`\<`T`\> \| (() => `PromiseLike`\<`T`\>)

A Promise or an async function.

##### Returns

`PromiseLike`\<`Result`\<`T`, `E`\>\>

A [Result] tuple containing `[undefined, data]` on success or `[error]` on failure.
Error first encourages error handling. Returning a tuple makes renaming
error and data easier, especially useful if you call it many times.
