# 🔧 Backend API Requirements for Notification Tabs

## 🚨 **Current Issue: 500 Errors**

The frontend is currently getting 500 errors because the new notification endpoints don't exist on your backend yet.

## 🛠️ **Temporary Solution Applied**

I've temporarily modified the frontend to use the existing `/notifications` endpoint with different filtering:

- **"اعلانات من" (My Notifications)**: Shows all notifications (no type filter)
- **"اعلانات دوستان من" (Friends Activity)**: Shows only "like" notifications (temporary workaround)

## 🎯 **Required Backend Endpoints**

You need to implement these two new endpoints:

### **1. GET /notifications/my**
**Purpose:** Get notifications directed to the current user

**Request:**
```
GET /notifications/my?page=1&pageSize=20
Authorization: Bearer <token>
```

**Response:**
```json
{
  "code": "GET_NOTIFICATIONS_SUCCESSFULLY",
  "data": {
    "data": [
      {
        "_id": "notification_id",
        "recipientId": "user_id",
        "senderId": "sender_id",
        "type": "like",
        "postId": "post_id",
        "isRead": false,
        "data": {
          "senderUsername": "username",
          "postCaption": "post caption"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "totalCount": 10,
    "page": "1",
    "pageSize": "20",
    "totalPages": 1
  }
}
```

### **2. GET /notifications/friends-activity**
**Purpose:** Get activity notifications from friends

**Request:**
```
GET /notifications/friends-activity?page=1&pageSize=20
Authorization: Bearer <token>
```

**Response:** Same structure as above

## 🔄 **Backend Implementation Guide**

### **Option 1: Create New Routes**
```javascript
// In your notification routes
router.get('/my', authMiddleware, getMyNotifications);
router.get('/friends-activity', authMiddleware, getFriendsActivity);
```

### **Option 2: Modify Existing Route**
```javascript
// Modify existing /notifications route to handle tab parameter
router.get('/', authMiddleware, (req, res) => {
  const { tab } = req.query;
  
  if (tab === 'my') {
    return getMyNotifications(req, res);
  } else if (tab === 'friends-activity') {
    return getFriendsActivity(req, res);
  } else {
    return getAllNotifications(req, res);
  }
});
```

### **Controller Functions**
```javascript
// getMyNotifications - notifications where recipientId = current user
const getMyNotifications = async (req, res) => {
  const userId = req.user.id;
  const { page = 1, pageSize = 20 } = req.query;
  
  // Query notifications where recipientId = userId
  const notifications = await Notification.find({ recipientId: userId })
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip((page - 1) * pageSize);
    
  // Return with same structure as existing endpoint
};

// getFriendsActivity - notifications from friends
const getFriendsActivity = async (req, res) => {
  const userId = req.user.id;
  const { page = 1, pageSize = 20 } = req.query;
  
  // Get user's friends
  const user = await User.findById(userId).populate('friends');
  const friendIds = user.friends.map(friend => friend._id);
  
  // Query notifications from friends
  const notifications = await Notification.find({ 
    senderId: { $in: friendIds },
    recipientId: { $ne: userId } // Don't include notifications to self
  })
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip((page - 1) * pageSize);
    
  // Return with same structure as existing endpoint
};
```

## 🚀 **After Backend Implementation**

Once you implement these endpoints, update the frontend by reverting the temporary changes:

1. **Remove the temporary filtering logic**
2. **Use the new hooks:** `useMyNotifications` and `useFriendsActivity`
3. **Test both tabs work correctly**

## 🧪 **Testing**

1. **Test /notifications/my** - Should return user's notifications
2. **Test /notifications/friends-activity** - Should return friends' activity
3. **Verify response structure** matches existing notification format
4. **Check pagination** works correctly
5. **Test authentication** - endpoints should require valid token

---

## 📝 **Quick Fix for Now**

The frontend will work with the temporary solution, but for the best user experience, implement the proper backend endpoints as soon as possible! 🚀
