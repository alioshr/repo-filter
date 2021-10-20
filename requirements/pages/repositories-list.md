# Repositories List Page

> ## Success case

1. ✅ Presents 'try me out' message on start
2. ✅ Validates if the name input is presented
2. ✅ Validates if content is returned from the http request as there is no **204** error on this endpoint
3. ✅ Loads skeletons while getting
4. ✅ Paginates and allows per items pagination
5. ✅ Loads the results accordingly

> ## Exceptions 

1. ✅ Returns UnexpectedError if the http request returns **500**
2. ✅ Returns UnavailableError if the http request **503**
3. ✅ Returns NoContentError if no data is returned with status **200**
4. ✅ Returns UnexpectedError if the http request **403**