import express from 'express';
import cookieParser from 'cookie-parser';

import trips from './trips.js';
import places from './places.js';
import memories from './memories.js';
import sessions from './sessions.js';
import users from './users.js';
import { USER_ROLES, PERMISSIONS, hasPermission, getUserRole } from './serverPermissions.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.static('./dist'));
app.use(express.json());

// 基础认证中间件 - 检查用户是否登录
const checkLoggedIn = (req, res, next) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  
  // 将用户信息附加到req对象，以便后续中间件使用
  req.username = username;
  req.role = sessions.getSessionRole(sid);
  next();
};

// 检查权限中间件
const checkPermission = (permission) => (req, res, next) => {
  if (!req.username) {
    return checkLoggedIn(req, res, () => {
      checkPermission(permission)(req, res, next);
    });
  }
  
  if (!hasPermission(req.role, permission)) {
    res.status(403).json({ error: 'auth-insufficient' });
    return;
  }
  
  next();
};

// 角色检查中间件 - 检查用户是否为管理员
const checkAdmin = (req, res, next) => {
  if (!req.username) {
    return checkLoggedIn(req, res, () => {
      checkAdmin(req, res, next);
    });
  }
  
  if (req.role !== USER_ROLES.ADMIN) {
    res.status(403).json({ error: 'auth-insufficient' });
    return;
  }
  
  next();
};

// 辅助函数：查找拥有特定资源的用户和资源列表
function findResourceOwner(resourceType, resourceId) {
  const allUsers = users.getAllUsers();
  
  for (const [username, userData] of Object.entries(allUsers)) {
    if (username !== 'dog' && userData.tripList) {
      // 根据资源类型检查
      switch(resourceType) {
        case 'trip':
          if (userData.tripList.contains(resourceId)) {
            return { username, tripList: userData.tripList };
          }
          break;
        case 'place':
          if (userData.tripList.containsPlace(resourceId)) {
            return { username, tripList: userData.tripList };
          }
          break;
        case 'memory':
          if (userData.tripList.containsMemory(resourceId)) {
            return { username, tripList: userData.tripList };
          }
          break;
      }
    }
  }
  
  return null;
}

// Session 相关路由

app.get('/api/session', checkLoggedIn, (req, res) => {
  res.json({ username: req.username, role: req.role });
});

app.post('/api/session', (req, res) => {
  const { username } = req.body;

  if(!users.isValid(username)) {
    res.status(400).json({ error: 'required-username' });
    return;
  }

  if(username === 'dog') {
    res.status(403).json({ error: 'auth-insufficient' });
    return;
  }

  const existingUserData = users.getUserData(username);
  if(!existingUserData) {
    res.status(401).json({ error: 'user-not-found', message: 'User not registered' });
    return;
  }

  const sid = sessions.addSession(username);
  const role = sessions.getSessionRole(sid);

  res.cookie('sid', sid);
  res.json({
    trips: existingUserData.tripList.getTrips()
  });
});

app.delete('/api/session', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';

  if(sid) {
    res.clearCookie('sid');
  }

  if(username) {
    sessions.deleteSession(sid);
  }

  res.json({ username: '' });
});

// 用户相关路由

app.post('/api/users', (req, res) => {
  const { username } = req.body;

  if(!users.isValid(username)) {
    res.status(400).json({ error: 'required-username' });
    return;
  }

  if(username === 'dog') {
    res.status(403).json({ error: 'auth-insufficient' });
    return;
  }

  const existingUser = users.getUserData(username);
  if(existingUser) {
    res.status(409).json({ error: 'username-exists' });
    return;
  }

  users.addUserData(username, {
    tripList: trips.makeTripList(),
  });

  const sid = sessions.addSession(username);
  const role = sessions.getSessionRole(sid);

  res.cookie('sid', sid);
  res.json({
    role,
    trips: users.getUserData(username).tripList.getTrips()
  });
});

app.get('/api/users/role', checkLoggedIn, (req, res) => {
  res.json({ role: req.role });
});

// Trip 相关路由

app.get('/api/trips', checkPermission(PERMISSIONS.VIEW_TRIPS), (req, res) => {
  // 如果是管理员，获取所有用户的旅行
  if (req.role === USER_ROLES.ADMIN) {
    const allUsers = users.getAllUsers();
    const allTrips = {};
    
    Object.entries(allUsers).forEach(([userKey, userData]) => {
      if (userKey !== 'dog' && userData.tripList) {
        const userTrips = userData.tripList.getTrips();
        Object.entries(userTrips).forEach(([tripId, trip]) => {
          allTrips[tripId] = {...trip, username: userKey};
        });
      }
    });
    
    res.json(allTrips);
  } else {
    // 普通用户只能查看自己的旅行
    res.json(users.getUserData(req.username).tripList.getTrips());
  }
});

app.get('/api/trips/paginated', checkPermission(PERMISSIONS.VIEW_TRIPS), (req, res) => {
  // 准备要分页的trips
  let tripsToProcess = {};
  
  // 如果是管理员，获取所有用户的旅行
  if (req.role === USER_ROLES.ADMIN) {
    const allUsers = users.getAllUsers();
    
    Object.entries(allUsers).forEach(([userKey, userData]) => {
      if (userKey !== 'dog' && userData.tripList) {
        const userTrips = userData.tripList.getTrips();
        Object.entries(userTrips).forEach(([tripId, trip]) => {
          tripsToProcess[tripId] = {...trip, username: userKey};
        });
      }
    });
  } else {
    // 普通用户只能查看自己的旅行
    tripsToProcess = users.getUserData(req.username).tripList.getTrips();
  }
  
  // Parse pagination parameters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  // Apply filters
  let filteredTrips = Object.values(tripsToProcess);
  
  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    filteredTrips = filteredTrips.filter(trip => 
      trip.title.toLowerCase().includes(searchTerm) || 
      (trip.description && trip.description.toLowerCase().includes(searchTerm))
    );
  }
  
  if (req.query.category) {
    filteredTrips = filteredTrips.filter(trip => 
      trip.category === req.query.category
    );
  }
  
  if (req.query.startDate) {
    filteredTrips = filteredTrips.filter(trip => 
      trip.startDate >= req.query.startDate
    );
  }
  
  if (req.query.endDate) {
    filteredTrips = filteredTrips.filter(trip => 
      trip.endDate <= req.query.endDate
    );
  }
  
  // 管理员可以按用户名筛选
  if (req.role === USER_ROLES.ADMIN && req.query.username) {
    filteredTrips = filteredTrips.filter(trip => 
      trip.username === req.query.username
    );
  }
  
  // Calculate pagination
  const totalTrips = filteredTrips.length;
  const totalPages = Math.ceil(totalTrips / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  // Get paginated trips
  const paginatedTrips = filteredTrips.slice(startIndex, endIndex);
  
  // Convert back to object format
  const tripsObject = {};
  paginatedTrips.forEach(trip => {
    tripsObject[trip.id] = trip;
  });
  
  res.json({
    trips: tripsObject,
    pagination: {
      page,
      limit,
      totalTrips,
      totalPages
    }
  });
});

app.post('/api/trips', checkPermission(PERMISSIONS.MANAGE_TRIPS), (req, res) => {
  const { title, description, startDate, endDate, category } = req.body;
  
  // Validate required fields
  if(!title) {
    res.status(400).json({ error: 'required-title' });
    return;
  }
  
  // Validate date range if both dates are provided
  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    res.status(400).json({ error: 'invalid-date-range' });
    return;
  }
  
  // Additional validation for Adventure category
  if (category === 'Adventure' && !description) {
    res.status(400).json({ error: 'required-description-for-adventure' });
    return;
  }
  
  const tripList = users.getUserData(req.username).tripList;
  const id = tripList.addTrip(title, description, startDate, endDate, category, req.username);
  res.json(tripList.getTrip(id));
});

app.get('/api/trips/:id', checkPermission(PERMISSIONS.VIEW_TRIPS), (req, res) => {
  const { id } = req.params;
  
  // 尝试从当前用户获取
  const userTripList = users.getUserData(req.username).tripList;
  if (userTripList.contains(id)) {
    res.json(userTripList.getTrip(id));
    return;
  }
  
  // 如果不是当前用户的，且是管理员，查找其他用户
  if (req.role === USER_ROLES.ADMIN) {
    const owner = findResourceOwner('trip', id);
    if (owner) {
      const trip = owner.tripList.getTrip(id);
      res.json({...trip, username: owner.username});
      return;
    }
  }
  
  res.status(404).json({ error: 'noSuchId', message: `No trip with id ${id}` });
});

app.patch('/api/trips/:id', checkPermission(PERMISSIONS.MANAGE_TRIPS), (req, res) => {
  const { id } = req.params;
  const { title, description, startDate, endDate, category } = req.body;
  
  // 验证日期范围
  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    res.status(400).json({ error: 'invalid-date-range' });
    return;
  }
  
  // 尝试更新当前用户的trip
  const userTripList = users.getUserData(req.username).tripList;
  if (userTripList.contains(id)) {
    userTripList.updateTrip(id, { title, description, startDate, endDate, category });
    res.json(userTripList.getTrip(id));
    return;
  }
  
  // 如果不是当前用户的，且是管理员，查找和更新
  if (req.role === USER_ROLES.ADMIN) {
    const owner = findResourceOwner('trip', id);
    if (owner) {
      owner.tripList.updateTrip(id, { title, description, startDate, endDate, category });
      const updatedTrip = owner.tripList.getTrip(id);
      res.json({...updatedTrip, username: owner.username});
      return;
    }
  }
  
  res.status(404).json({ error: 'noSuchId', message: `No trip with id ${id}` });
});

app.put('/api/trips/:id', checkPermission(PERMISSIONS.MANAGE_TRIPS), (req, res) => {
  const { id } = req.params;
  const { title, description, startDate, endDate, category } = req.body;
  
  // Validate required fields
  if(!title) {
    res.status(400).json({ error: 'required-title' });
    return;
  }
  
  // Validate date range
  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    res.status(400).json({ error: 'invalid-date-range' });
    return;
  }
  
  // 尝试替换当前用户的trip
  const userTripList = users.getUserData(req.username).tripList;
  if (userTripList.contains(id)) {
    userTripList.replaceTrip(id, { title, description, startDate, endDate, category });
    res.json(userTripList.getTrip(id));
    return;
  }
  
  // 如果不是当前用户的，且是管理员，查找和替换
  if (req.role === USER_ROLES.ADMIN) {
    const owner = findResourceOwner('trip', id);
    if (owner) {
      owner.tripList.replaceTrip(id, { title, description, startDate, endDate, category });
      const updatedTrip = owner.tripList.getTrip(id);
      res.json({...updatedTrip, username: owner.username});
      return;
    }
  }
  
  res.status(404).json({ error: 'noSuchId', message: `No trip with id ${id}` });
});

app.delete('/api/trips/:id', checkLoggedIn, (req, res) => {
  const { id } = req.params;
  
  // 尝试从当前用户删除
  const userTripList = users.getUserData(req.username).tripList;
  if (userTripList.contains(id)) {
    userTripList.deleteTrip(id);
    res.json({ message: `trip ${id} deleted` });
    return;
  }
  
  // 如果不是当前用户的，且是管理员，查找和删除
  if (req.role === USER_ROLES.ADMIN) {
    const owner = findResourceOwner('trip', id);
    if (owner) {
      owner.tripList.deleteTrip(id);
      res.json({ message: `trip ${id} deleted` });
      return;
    }
  }
  
  res.status(404).json({ error: 'noSuchId', message: `No trip with id ${id}` });
});

// Place 相关路由
app.get('/api/trips/:tripId/places', checkPermission(PERMISSIONS.VIEW_TRIPS), (req, res) => {
  const { tripId } = req.params;
  
  // 先检查管理员权限
  if (req.role === USER_ROLES.ADMIN) {
    const owner = findResourceOwner('trip', tripId);
    if (owner) {
      res.json(owner.tripList.getPlaces(tripId));
      return;
    }
  }
  
  // 再检查当前用户
  const userTripList = users.getUserData(req.username).tripList;
  if (userTripList.contains(tripId)) {
    res.json(userTripList.getPlaces(tripId));
    return;
  }
  
  res.status(404).json({ error: 'noSuchId', message: `No trip with id ${tripId}` });
});

app.post('/api/trips/:tripId/places', checkPermission(PERMISSIONS.MANAGE_TRIPS), (req, res) => {
  const { tripId } = req.params;
  const { name, description, date, includeInItinerary } = req.body;
  
  // Validate required fields
  if(!name) {
    res.status(400).json({ error: 'required-name' });
    return;
  }
  
  // Validate that date is provided if includeInItinerary is true
  if (includeInItinerary && !date) {
    res.status(400).json({ error: 'required-date-for-itinerary' });
    return;
  }
  
  // 尝试在当前用户的trip中添加
  const userTripList = users.getUserData(req.username).tripList;
  if (userTripList.contains(tripId)) {
    const id = userTripList.addPlace(tripId, name, description, date, includeInItinerary);
    res.json(userTripList.getPlace(id));
    return;
  }
  
  // 如果不是当前用户的trip，且是管理员，查找和添加
  if (req.role === USER_ROLES.ADMIN) {
    const owner = findResourceOwner('trip', tripId);
    if (owner) {
      const id = owner.tripList.addPlace(tripId, name, description, date, includeInItinerary);
      res.json(owner.tripList.getPlace(id));
      return;
    }
  }
  
  res.status(404).json({ error: 'noSuchId', message: `No trip with id ${tripId}` });
});

app.patch('/api/places/:id', checkPermission(PERMISSIONS.MANAGE_TRIPS), (req, res) => {
  const { id } = req.params;
  const { name, description, date, includeInItinerary } = req.body;
  
  // Validate that date is provided if includeInItinerary is true
  if (includeInItinerary && !date) {
    res.status(400).json({ error: 'required-date-for-itinerary' });
    return;
  }
  
  // 尝试更新当前用户的place
  const userTripList = users.getUserData(req.username).tripList;
  if (userTripList.containsPlace(id)) {
    userTripList.updatePlace(id, { name, description, date, includeInItinerary });
    res.json(userTripList.getPlace(id));
    return;
  }
  
  // 如果不是当前用户的，且是管理员，查找和更新
  if (req.role === USER_ROLES.ADMIN) {
    const owner = findResourceOwner('place', id);
    if (owner) {
      owner.tripList.updatePlace(id, { name, description, date, includeInItinerary });
      res.json(owner.tripList.getPlace(id));
      return;
    }
  }
  
  res.status(404).json({ error: 'noSuchId', message: `No place with id ${id}` });
});

app.delete('/api/places/:id', checkPermission(PERMISSIONS.MANAGE_TRIPS), (req, res) => {
  const { id } = req.params;
  
  // 尝试从当前用户删除
  const userTripList = users.getUserData(req.username).tripList;
  if (userTripList.containsPlace(id)) {
    userTripList.deletePlace(id);
    res.json({ message: `place ${id} deleted` });
    return;
  }
  
  // 如果不是当前用户的，且是管理员，查找和删除
  if (req.role === USER_ROLES.ADMIN) {
    const owner = findResourceOwner('place', id);
    if (owner) {
      owner.tripList.deletePlace(id);
      res.json({ message: `place ${id} deleted` });
      return;
    }
  }
  
  res.status(404).json({ error: 'noSuchId', message: `place ${id} did not exist` });
});

// Memory 相关路由
app.get('/api/trips/:tripId/memories', checkPermission(PERMISSIONS.VIEW_TRIPS), (req, res) => {
  const { tripId } = req.params;
  
  // 先检查管理员权限
  if (req.role === USER_ROLES.ADMIN) {
    const owner = findResourceOwner('trip', tripId);
    if (owner) {
      res.json(owner.tripList.getMemories(tripId));
      return;
    }
  }
  
  // 再检查当前用户
  const userTripList = users.getUserData(req.username).tripList;
  if (userTripList.contains(tripId)) {
    res.json(userTripList.getMemories(tripId));
    return;
  }
  
  res.status(404).json({ error: 'noSuchId', message: `No trip with id ${tripId}` });
});

app.post('/api/trips/:tripId/memories', checkPermission(PERMISSIONS.MANAGE_TRIPS), (req, res) => {
  const { tripId } = req.params;
  const { title, description, date, imageUrl, placeId } = req.body;
  
  // Validate required fields
  if(!title) {
    res.status(400).json({ error: 'required-title' });
    return;
  }
  
  // Validate that date is provided if placeId is provided
  // if (placeId && !date) {
  //   res.status(400).json({ error: 'required-date-for-place' });
  //   return;
  // }
  
  // Validate image URL format if provided
  if (imageUrl && !isValidUrl(imageUrl)) {
    res.status(400).json({ error: 'invalid-image-url' });
    return;
  }
  
  // 尝试在当前用户的trip中添加
  const userTripList = users.getUserData(req.username).tripList;
  if (userTripList.contains(tripId)) {
    const id = userTripList.addMemory(tripId, title, description, date, imageUrl, placeId);
    res.json(userTripList.getMemory(id));
    return;
  }
  
  // 如果不是当前用户的trip，且是管理员，查找和添加
  if (req.role === USER_ROLES.ADMIN) {
    const owner = findResourceOwner('trip', tripId);
    if (owner) {
      const id = owner.tripList.addMemory(tripId, title, description, date, imageUrl, placeId);
      res.json(owner.tripList.getMemory(id));
      return;
    }
  }
  
  res.status(404).json({ error: 'noSuchId', message: `No trip with id ${tripId}` });
});

app.patch('/api/memories/:id', checkPermission(PERMISSIONS.MANAGE_TRIPS), (req, res) => {
  const { id } = req.params;
  const { title, description, date, imageUrl, placeId } = req.body;
  
  // Validate that date is provided if placeId is provided
  if (placeId && !date) {
    res.status(400).json({ error: 'required-date-for-place' });
    return;
  }
  
  // Validate image URL format if provided
  if (imageUrl && !isValidUrl(imageUrl)) {
    res.status(400).json({ error: 'invalid-image-url' });
    return;
  }
  
  // 尝试更新当前用户的memory
  const userTripList = users.getUserData(req.username).tripList;
  if (userTripList.containsMemory(id)) {
    userTripList.updateMemory(id, { title, description, date, imageUrl, placeId });
    res.json(userTripList.getMemory(id));
    return;
  }
  
  // 如果不是当前用户的，且是管理员，查找和更新
  if (req.role === USER_ROLES.ADMIN) {
    const owner = findResourceOwner('memory', id);
    if (owner) {
      owner.tripList.updateMemory(id, { title, description, date, imageUrl, placeId });
      res.json(owner.tripList.getMemory(id));
      return;
    }
  }
  
  res.status(404).json({ error: 'noSuchId', message: `No memory with id ${id}` });
});

app.delete('/api/memories/:id', checkPermission(PERMISSIONS.MANAGE_TRIPS), (req, res) => {
  const { id } = req.params;
  
  // 尝试从当前用户删除
  const userTripList = users.getUserData(req.username).tripList;
  if (userTripList.containsMemory(id)) {
    userTripList.deleteMemory(id);
    res.json({ message: `memory ${id} deleted` });
    return;
  }
  
  // 如果不是当前用户的，且是管理员，查找和删除
  if (req.role === USER_ROLES.ADMIN) {
    const owner = findResourceOwner('memory', id);
    if (owner) {
      owner.tripList.deleteMemory(id);
      res.json({ message: `memory ${id} deleted` });
      return;
    }
  }
  
  res.status(404).json({ error: 'noSuchId', message: `memory ${id} did not exist` });
});

// 管理员路由

app.get('/api/admin/trips', checkAdmin, (req, res) => {
  const allUsers = users.getAllUsers();
  const result = {};
  
  Object.entries(allUsers).forEach(([username, userData]) => {
    if (username !== 'dog') {
      result[username] = {
        trips: userData.tripList.getTrips(),
      };
    }
  });
  
  res.json(result);
});

app.get('/api/admin/stats', checkAdmin, (req, res) => {
  const allUsers = users.getAllUsers();
  const stats = {
    totalUsers: Object.keys(allUsers).length,
    totalTrips: 0,
    tripsByCategory: {},
    tripsPerUser: {},
    placesCount: 0,
    memoriesCount: 0
  };
  
  Object.entries(allUsers).forEach(([username, userData]) => {
    if (userData.tripList) {
      const userTrips = userData.tripList.getTrips();
      const tripCount = Object.keys(userTrips).length;
      stats.totalTrips += tripCount;
      stats.tripsPerUser[username] = tripCount;
      
      // 计算各类别的trip数量
      Object.values(userTrips).forEach(trip => {
        if (trip.category) {
          stats.tripsByCategory[trip.category] = (stats.tripsByCategory[trip.category] || 0) + 1;
        }
      });
      
      // 计算地点和记忆数量
      if (userData.tripList.getPlaces) {
        Object.keys(userTrips).forEach(tripId => {
          const places = userData.tripList.getPlaces(tripId);
          stats.placesCount += Object.keys(places).length;
        });
      }
      
      if (userData.tripList.getMemories) {
        Object.keys(userTrips).forEach(tripId => {
          const memories = userData.tripList.getMemories(tripId);
          stats.memoriesCount += Object.keys(memories).length;
        });
      }
    }
  });
  
  res.json(stats);
});

// Helper function to validate URL
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
