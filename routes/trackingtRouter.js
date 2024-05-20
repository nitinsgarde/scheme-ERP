// import controllers review, products
const usercontroller = require('../controllers/bm/usercontroller.js')


const router = require('express').Router()

///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////// USER API  ////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

//1.add user in db
router.post('/adduser', usercontroller.addUser) 

//2.show user list from db
router.post('/user_list/:page', usercontroller.user_list) 

//3.show single user from db
router.post('/single_user', usercontroller.single_user) 

//4.add client in db
router.post('/addclient', usercontroller.addclient) 

//5.show client list from db
router.post('/client_list/:page', usercontroller.client_list) 

//6.show single client from db
router.post('/single_client/:page', usercontroller.single_client)

//7.search client from db
router.post('/search_client', usercontroller.search_client)

//8.update current status of client from db
router.put('/update_status_close', usercontroller.update_status_close)

//8.update current status of client from db
router.put('/update_status_return', usercontroller.update_status_return)

//9.add installment number in db
router.post('/ad_install', usercontroller.ad_install)

//10.display client with same created_by
router.post('/same_createdby/:page', usercontroller.same_createdby)

//11.show users clientname,installment_no,amount & date from db
router.post('/receipt_list/:page', usercontroller.receipt_list) 

//12.diplay installment number for a client from db
router.post('/install_client/:page', usercontroller.install_client)

//13.Admin login in db
router.post('/admin_login', usercontroller.admin_login)

//14.list of users(staff) of a society for admin from db
router.post('/admin_users/:page', usercontroller.admin_users)

//15.log in in db
router.post('/staff_login', usercontroller.staff_login)

//16.log in in db
router.post('/client_login', usercontroller.client_login)

//17.closed client list for staff
router.post('/closed_client/:page', usercontroller.closed_client)

//18.return client list for staff
router.post('/return_client/:page', usercontroller.return_client)

//19.close client list for admin
router.post('/admin_closed_client/:page', usercontroller.admin_closed_client)

//20.return client list for admin
router.post('/admin_return_client/:page', usercontroller.admin_return_client)


/// Map module
module.exports = router