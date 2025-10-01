export const NOTIFICATION_URLS = {
  BASE: "/notifications",
  GET_ALL: "/notifications",
  GET_BY_ID: (id: string) => `/notifications/${id}`,
  UNREAD_COUNT: "/notifications/unread-count",
  MARK_AS_READ: (id: string) => `/notifications/${id}/read`,
  MARK_ALL_AS_READ: "/notifications/read-all",
  DELETE: (id: string) => `/notifications/${id}`,
  DELETE_ALL: "/notifications",
} as const;

