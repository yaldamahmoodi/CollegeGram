usage:
check if Erorr is in Error_Messages
if not:

- add to error message ( try not to add chert & pert )

normal errors:

- next(new ValidationError("ErrorCatalog Key")

handler error in async handlers:

- catch (error: unknown) { if (error instanceof APIError) return next(error) }

