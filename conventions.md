## models and schema 
- where ever we have id after an instance use _ before like: user_id
- createdAt , updatedAt without _

## commits


## Output and Response Conventions
### API Response Format

All API responses follow a consistent JSON structure.  
Responses are divided into **error** and **success** categories.

---

### Error Response

- **Status Code**: Standard [HTTP status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).
- **code**: Machine-readable identifier of the error.
- **detail** *(optional)*: Human-readable explanation of the error. May or may not be present.

### Example
```json
{
  "code": "NOT_FOUND",
  "detail": "User not found"
}
```

---

### Success Response

- **Status Code**: Standard HTTP status codes (e.g., `200`, `201`).
- **code**: Machine-readable identifier of the success event.
- **message**: Human-readable confirmation message.
- **data**: Object containing the result payload (may vary depending on endpoint).

### Example
```json
{
  "code": "REGISTERED",
  "message": "User registered successfully",
  "data": {
    "id": "12345",
    "email": "user@example.com"
  }
}
```

---

### Notes
- `code` should always be **short, descriptive, and predictable** (e.g., `NOT_FOUND`, `REGISTERED`, `INVALID_INPUT`).
- `detail` is **optional** and used mainly in errors to help debugging.
- `data` is only included on success responses and should contain relevant business data.
- Clients should **always rely on both HTTP status code and `code`** for correct handling.

