export const CatalogueErrors = {
    DUPLICATE_FIELD: {code: "DUPLICATE_FIELD", message: "Field already exists"},
    DUPLICATE_CREDENTIALS: {code: "DUPLICATE_CREDENTIALS", message: "Credentials already exists"},
    DUPLICATE_EMAIL: {code: "DUPLICATE_EMAIL", message: "Email already exists"},
    DUPLICATE_USERNAME: {code: "DUPLICATE_USERNAME", message: "Username already exists"},
    FORBIDDEN: {code: "FORBIDDEN", message: "Forbidden"},
    INTERNAL_SERVER_ERROR: {code: "INTERNAL_SERVER_ERROR", message: "Internal server error"},
    INVALID_CREDENTIALS: {code: "INVALID_CREDENTIALS", message: "Invalid credentials"},
    INVALID_TOKEN: {code: "INVALID_TOKEN", message: "Invalid token"},
    INVALID_EMAIL: {code: "INVALID_EMAIL", message: "Invalid email"},
    INVALID_PASSWORD: {code: "INVALID_PASSWORD", message: "Invalid password"},
    INVALID_USERNAME: {code: "INVALID_USERNAME", message: "Invalid username"},
    NOT_FOUND: {code: "NOT_FOUND", message: "Resource not found"},
    NOT_FOUND_USER: {code: "NOT_FOUND_USER", message: "User not found"},
    TOKEN_NOT_PROVIDED: {code: "TOKEN_NOT_PROVIDED", message: "Token not provided"},
    TOKEN_EXPIRED: {code: "TOKEN_EXPIRED", message: "Token expired"},
    UNAUTHORIZED: {code: "UNAUTHORIZED", message: "Unauthorized"},
    NO_FILES_UPLOADED: {code: "NO_FILES_UPLOADED", message: "No files uploaded"},
    ALREADY_DONE: {code: "ALREADY_DONE", message: "Already done"},
    NOT_SAVED: {code: "NOT_SAVED", message: "Not saved"},
    ALREADY_SAVED: {code: "ALREADY_SAVED", message: "Already saved"},
    YOU_CANNOT_FOLLOW_YOURSELF: {code: "YOU_CANNOT_FOLLOW_YOURSELF", message: "YOU_CANNOT_FOLLOW_YOURSELF"},
    YOU_CANNOT_UNFOLLOW_YOURSELF: {code: "YOU_CANNOT_UNFOLLOW_YOURSELF", message: "YOU_CANNOT_UNFOLLOW_YOURSELF"},
    SAVE_NOT_FOUND: {code: "SAVE_NOT_FOUND", message: "SAVE_NOT_FOUND"},
    NO_DATA_PROVIDED: {code: "NO_DATA_PROVIDED", message: "No data provided  for update"},
    CONTENT_REQUIRED: {code: "CONTENT_REQUIRED", message: "Content is required"},
    INVALID_COMMENT_ID:{code: "INVALID_COMMENT_ID", message: "Invalid com identifier"},
    INVALID_POST_ID:{code: "INVALID_POST_ID", message: "Invalid post ID"},
    FOLLOW_REQUEST_SENT: {code: "FOLLOW_REQUEST_SENT", message: "Follow request sent"},
    YOU_CANNOT_ACCEPT_YOURSELF: {code: "YOU_CANNOT_ACCEPT_YOURSELF", message: "You cannot accept yourself"},
    YOU_CANNOT_REJECT_YOURSELF: {code: "YOU_CANNOT_REJECT_YOURSELF", message: "You cannot reject yourself"},
    CAN_NOT_ADD_YOURSELF_TO_CLOSE_FRIEND:{code:"CAN_NOT_ADD_YOURSELF_TO_CLOSE_FRIEND",message:"invalid request"}
} as const;

export type ErrorCode = keyof typeof CatalogueErrors;







