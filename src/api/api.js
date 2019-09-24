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
export const getPageList = (projectId) => {
  return get(`/uitest/projects/${projectId}/pages`).then(res => res);
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
export const editElement = (projectId, pageId , elementId, formData) => {
  return put(`/uitest/projects/${projectId}/pages/${pageId}/elements/${elementId}`,formData).then(res => res);
};
// 删除Element
export const deleteElement = (projectId, pageId, elementId) => {
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

// ----------------用例操作-----------------
//添加用例

export const postCase = (projectId, formData) => {
  return post(`/uitest/projects/${projectId}/cases`,formData).then(res => res);
};
//获取用例列表
export const getCaseList = (projectId) => {
  return get(`/uitest/projects/${projectId}/cases`).then(res => res);
};
// 更新用例
export const putCase = (projectId, caseId, formData ) => {
  return put(`/uitest/projects/${projectId}/cases/${caseId}`,formData).then(res => res);
};
// 删除用例
export const deleteCase = (projectId, caseId) => {
  return remove(`/uitest/projects/${projectId}/cases/${caseId}`).then(res => res);
};

// ----------------用例步骤操作-----------------
//添加步骤

export const postStep = (projectId, caseId,formData) => {
  return post(`/uitest/projects/${projectId}/cases/${caseId}/steps`,formData).then(res => res);
};
//获取步骤列表
export const getStepList = (projectId, caseId) => {
  return get(`/uitest/projects/${projectId}/cases/${caseId}/steps`).then(res => res);
};
// 更新步骤
export const putStep = (projectId, caseId, stepId , formData ) => {
  return put(`/uitest/projects/${projectId}/cases/${caseId}/steps/${stepId}`,formData).then(res => res);
};
// 删除步骤
export const deleteStep = (projectId, caseId, stepId ,) => {
  return remove(`/uitest/projects/${projectId}/cases/${caseId}/steps/${stepId}`).then(res => res);
};


// ----------------用例集操作-----------------
//添加用例集

export const postSuit = (projectId, formData) => {
  return post(`/uitest/projects/${projectId}/case_suit`,formData).then(res => res);
};
//获取用例集列表
export const getSuitList = (projectId) => {
  return get(`/uitest/projects/${projectId}/case_suit`).then(res => res);
};
// 更新用例集
export const putSuit = (projectId, suitId, formData ) => {
  return put(`/uitest/projects/${projectId}/case_suit/${suitId}`,formData).then(res => res);
};
// 删除用例集
export const deleteSuit = (projectId, suitId) => {
  return remove(`/uitest/projects/${projectId}/case_suit/${suitId}`).then(res => res);
};

// ----------------用例集步骤操作-----------------
//添加用例集步骤

export const postSuitStep = (projectId, suitId,formData) => {
  return post(`/uitest/projects/${projectId}/case_suit/${suitId}/steps`,formData).then(res => res);
};
//获取用例集步骤列表
export const getSuitStepList = (projectId, suitId) => {
  return get(`/uitest/projects/${projectId}/case_suit/${suitId}/steps`).then(res => res);
};
// 更新用例集步骤
export const putSuitStep = (projectId, suitId, stepId , formData ) => {
  return put(`/uitest/projects/${projectId}/case_suit/${suitId}/steps/${stepId}`,formData).then(res => res);
};
// 删除用例集步骤
export const deleteSuitStep = (projectId, suitId, stepId ,) => {
  return remove(`/uitest/projects/${projectId}/case_suit/${suitId}/steps/${stepId}`).then(res => res);
};
