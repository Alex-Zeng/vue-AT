import {post, get, remove , put, patch} from './index'

// 登录接口
export const postLogin = params => {
  return post(`/admin/login`, params).then(res => res);
};
// 项目列表
export const getProjectList = params => {
  return get(`/admin/projects`).then(res => res);
};

// ----------------PageObject操作-----------------
//添加PageObject操作
export const postPage = (projectId, formData) => {
  return post(`/uitest/projects/${projectId}/pages`, formData).then(res => res);
};
//更新PageObject操作
export const putPage = (projectId, pageId, formData) => {
  return put(`/uitest/projects/${projectId}/pages/${pageId}`, formData).then(res => res);
};
//删除PageObject操作
export const deletePage = (projectId, pageId) => {
  return remove(`/uitest/projects/${projectId}/pages/${pageId}`).then(res => res);
};
// 获取PageObject操作
export const getPageList = params => {
  return get(`/uitest/projects/${params}/pages`).then(res => res);
};



// ----------------Element操作-----------------

//添加Element
export const postElement = (projectId, pageId ,formData) => {
  return post(`/uitest/projects/${projectId}/pages/${pageId}/elements`,formData).then(res => res);
};
// 获取Element列表
export const getElementList = (projectId, pageId) => {
  return get(`/uitest/projects/${projectId}/pages/${pageId}/elements`).then(res => res);
};
// 更新Element
export const editElement = (projectId, pageId , element_id, formData) => {
  return put(`/uitest/projects/${projectId}/pages/${pageId}/elements/${elementId}`,formData).then(res => res);
};
// 删除Element
export const deleteElement = (projectId, pageId, element_id) => {
  return remove(`/uitest/projects/${projectId}/pages/${pageId}/elements/${elementId}`).then(res => res);
};


// ----------------Action操作-----------------
//添加Action

export const postAction = (projectId, pageId, formData) => {
  return post(`/uitest/projects/${projectId}/pages/${pageId}/actions`,formData).then(res => res);
};
//获取Action列表
export const getActionList = (projectId, pageId) => {
  return get(`/uitest/projects/${projectId}/pages/${pageId}/actions`).then(res => res);
};
// 更新Action
export const editAction = (projectId, pageId ,actId,formData) => {
  return put(`/uitest/projects/${projectId}/pages/${pageId}/actions/${actId}`,formData).then(res => res);
};
// 删除Action
export const deleteAction = (projectId, pageId,actId) => {
  return remove(`/uitest/projects/${projectId}/pages/${pageId}/actions/${actId}`).then(res => res);
};



// ----------------Function操作-----------------
//添加Function

export const postFunction = (formData) => {
  return post(`/uitest/functions`,formData).then(res => res);
};
//获取Function列表
export const getFunctionList = () => {
  return get(`/uitest/functions`).then(res => res);
};
// 更新Function
export const editFunction = (function_id, formData ) => {
  return put(`/uitest/functions/${function_id}`,formData).then(res => res);
};
// 删除Function
export const deleteFunction = (function_id) => {
  return remove(`/uitest/functions/${function_id}`).then(res => res);
};
