import {del, get, post} from "./api_helper"
import {data} from "autoprefixer";

export const postRegister = data => post('/user/register', data)
export const postLogin = data => post('/user/login', data)
export const postSocialLogin = data => post('/user/social-login', data)
export const getVerify = data => get('/user/verify', data)
export const postRole = data => post('/user/role', data)
export const postConsent = data => post('/user/consent', data)
export const postForget = data => post('/user/forget', data)
export const postReset = data => post('/user/reset', data)
export const postApprove = data => post('/user/approve', data)
export const fetchProfile = data => get('/user/profile', data)
export const fetchDashboard = data => get('/user/dashboard', data)
export const fetchUserSessions = data => get('/user/sessions', data)
export const fetchUserLogs = data => get('/user/logs', data)

export const getSchools = data => get('/school/list', data)
export const postSchool = data => post('/school', data)
export const postSchoolUpdate = data => post('/school/settings', data)

export const fetchProducts = data => get('/store/products', data)
export const postProductAdd = data => post('/store/add', data)
export const postProductUpdate = data => post('/store/update', data)
export const delProduct = data => del('/store/delete', data)

export const fetchPurchases = data => get('/store/purchases', data)
export const postPurchase = data => post('/store/purchase', data)
export const postPurchaseStatus = data => post('/store/purchase-status', data)
export const postPurchaseApprove = data => post('/store/purchase-approve', data)

export const fetchWishlist = data => get('/user/wishlist', data)
export const postWishlist = data => post('/user/wishlist', data)
export const postGoal = data => post('/user/goal', data)

export const fetchStudents = data => get('/user/students', data)
export const fetchTeachers = data => get('/user/teachers', data)
export const fetchAdmins = data => get('/user/admins', data)
export const postAdmin = data => post('/user/admin', data)

export const fetchClasses = data => get('/class/list', data)
export const fetchCurrentClasses = data => get('/class/current', data)
export const fetchClass = data => get('/class/get', data)
export const postClass = data => post('/class/create', data)
export const postClassUpdate = data => post('/class/update', data)
export const delClass = data => del('/class/delete', data)

export const fetchTraits = data => get('/trait/list', data)
export const postTraitAdd = data => post('/trait/add', data)
export const postTraitUpdate = data => post('/trait/update', data)
export const delTrait = data => del('/trait/delete', data)

export const fetchAwards = data => get('/award/list', data)
export const fetchWeeklySummery = data => get('/award/week_summery', data)
export const postAwards = data => post('/award/create', data)
export const postAward = data => post('/award/student', data)

export const fetchAttendance = data => get('/attendance', data)
export const fetchAttendanceElements = data => get('/attendance/elements', data)
export const fetchAttendanceStatus = data => get('/attendance/status', data)
export const postAttendance = data => post('/attendance', data)

export const fetchQuizzes = data => get('/quiz/list', data)
export const fetchQuiz = data => get('/quiz/get', data)
export const postQuiz = data => post('/quiz/add', data)
export const postQuizUpdate = data => post('/quiz/update', data)
export const delQuiz = data => del('/quiz/delete', data)

export const fetchSubmissions = data => get('/quiz/submissions', data)
export const submitQuiz = data => post('/quiz/submit', data)

export const fetchPermissions = data => get('/role/permissions', data)
export const fetchRoles = data => get('/role/list', data)
export const fetchRole = data => get('/role/get', data)
export const postRoleAdd = data => post('/role/add', data)
export const postRoleDefault = data => post('/role/default', data)
export const postRoleUpdate = data => post('/role/update', data)
export const delRole = data => del('/role/delete', data)

export const fetchUser = data => get('/user/get', data)
export const addUser = data => post('/user/add', data)
export const updateUser = data => post('/user/update', data)
export const deleteUser = data => del('/user/delete', data)
export const deleteStudent = data => del('/user/delete/student', data)
export const updateStudent = data => post('/user/update/student', data)

export const fetchUnreadNotifications = data => get('/notification/unread', data)
export const fetchNotifications = data => get('/notification/list', data)
export const postNotificationRead = data => post('/notification/read', data)


export const fetchParentStudents = data => get('/parent/students', data)