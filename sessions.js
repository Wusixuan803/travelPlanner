import { randomUUID as uuid } from 'crypto';
import { getUserRole } from './serverPermissions.js';

const sessions = {};

function addSession(username) {
  const sid = uuid();
  
  // 获取用户角色 - 使用getUserRole函数，它会处理预定义用户和普通用户
  const role = getUserRole(username);
  
  sessions[sid] = {
    username,
    role
  };
  
  return sid;
}

function getSessionUser(sid) {
  return sessions[sid]?.username;
}

function getSessionRole(sid) {
  return sessions[sid]?.role;
}

function deleteSession(sid) {
  delete sessions[sid];
}

export default {
  addSession,
  getSessionUser,
  getSessionRole,
  deleteSession,
};
