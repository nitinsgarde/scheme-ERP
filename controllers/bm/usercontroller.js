const db = require('../../models/bm');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { Sequelize, QueryTypes, DATE, where, and, or } = require('sequelize');
const Op = Sequelize.Op;
const logger = require("../../logger");
const { YEAR, NULL } = require('mysql/lib/protocol/constants/types');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey');

// const datetime = require('node-datetime');



//create main Model

const user = db.bm
const clients = db.client
const instals = db.install

// main work

//////////////////////////
// 1. user registration///
//////////////////////////

const addUser = async (req, res) => {
  try {
    //const salt = await bcrypt.genSalt(4);
    const pswd = Math.floor(1000 + Math.random() * 9999);
    let usr = {
      username: req.body.username,
      mobile_no: req.body.mobile_no,
      password: cryptr.encrypt(pswd),
      user_type: req.body.user_type,
      society: req.body.society
    }
    const mobile_no = await user.findOne({ where: { mobile_no: req.body.mobile_no } });
    if (!req.body.username) {
      return res.status(401).send({ status: 401, message: "username is required" })
    } else if (!req.body.mobile_no) {
      return res.status(401).send({ status: 401, message: "mobile_no is required" })
    } else if (!req.body.user_type) {
      return res.status(401).send({ status: 401, message: "user_type is required" })
    } else if (!req.body.society) {
      return res.status(401).send({ status: 401, message: "society is required" })
    }

    if (!mobile_no) {
      const create_user = await user.create(usr)
      res.status(200).send({
        data: create_user,
        password: cryptr.decrypt(create_user.password)
      })
      logger.info(`registration successfull`);

      // logger.info("your password",cryptr.decrypt(user.password));
    } else {
      res.status(401).send({
        status: 401,
        message: "mobile_no already exits"
      })
    }

  } catch (error) {
    res.status(400).send({
      status: 400,
      message: error.message
    })
    logger.error(error.message);
  }

}
///////////////////////////////////////
///// .user login using mobile_no////
/////////////////////////////////////
const staff_login = async (req, res, next) => {

  const m_user = await user.findOne({ where: { mobile_no: req.body.mobile_no } });
  if (m_user) {
    const pass = cryptr.decrypt(m_user.password);
    // const pass = await cryptr.compare(req.body.password, m_user.password);
    //const pass = await user.findOne({ where: { password: req.body.password } })

    if (pass == req.body.password) {

      res.status(200).json({
        message: 'Logged In',

        id: m_user.id,
        username: m_user.username,
        mobile_no: m_user.mobile_no,
        //password: cryptr.decrypt(m_user.password),
        user_type: m_user.user_type,
        society: m_user.society
      });
      logger.info("Logged In");
    } else {
      res.status(400).json({
        status: 400,
        error: "Password Incorrect"
      });
      logger.error("Password Incorrect");
    }

  } else {
    res.status(404).json({ error: "User does not exist" });
    logger.error("User does not exist");
  }
}

// const encryptedString = cryptr.encrypt('bacon');
// const decryptedString = cryptr.decrypt(encryptedString);

// console.log(encryptedString); 
// console.log(decryptedString);


///////////////////////////////////////////////////
//////////2.User List from user tables////////////
/////////////////////////////////////////////////

const user_list = async (req, res) => {
  try {
    let society = req.body.society;
    let size = 10;
    let page = req.params.page;
    let offset = page * size;

    const userdata = await db.sequelize.query("SELECT id,username,user_type,society FROM user_tables where user_type='staff' and society=:society limit :limit offset :offset", {
      type: QueryTypes.SELECT,
      replacements: { society: society, limit: size, offset: offset }

    });
    res.status(200).send({
      data: userdata
    });
    logger.info(`success`);
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: error.message
    })
    logger.error(error.message);
  }
}
//const salt = await bcrypt.genSalt(10);

///////////////////////////////////////////////////////////
//////////3.select single user from user tables///////////
/////////////////////////////////////////////////////////

const single_user = async (req, res) => {
  try {
    let id = req.body.id;

    const singledata = await db.sequelize.query("SELECT u.id,u.username,u.mobile_no,u.user_type,u.society,COUNT(c.id) as clients FROM user_tables u, client_tables c where c.created_by=u.id  AND u.id=:id and user_type='staff'", {
      type: QueryTypes.SELECT,
      replacements: { id: id }

    });
    res.status(200).send({
      data: singledata
    });
    logger.info(`success`);
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: error.message
    })
    logger.error(error.message);
  }
}

//////////////////////////////////////
///4.insert client in client table///
////////////////////////////////////

const addclient = async (req, res) => {
  try {
    const c_pswd = Math.floor(1000 + Math.random() * 9999);
    let clnt = {
      clientname: req.body.clientname,
      installment_no: req.body.installment_no,
      mobile_no: req.body.mobile_no,
      password: cryptr.encrypt(c_pswd),
      amount: req.body.amount,
      address: req.body.address,
      plan: req.body.plan,
      created_by: req.body.created_by,
      current_status: req.body.current_status

    }
    const mobile_no = await clients.findOne({ where: { mobile_no: req.body.mobile_no } });
    if (!req.body.clientname) {
      return res.status(401).send({ status: 401, message: "clientname is required" })
    } else if (!req.body.mobile_no) {
      return res.status(401).send({ status: 401, message: "mobile_no is required" })
    } else if (!req.body.amount) {
      return res.status(401).send({ status: 401, message: "A amount is required" })
    } else if (!req.body.address) {
      return res.status(401).send({ status: 401, message: "A address is required" })
    } else if (!req.body.plan) {
      return res.status(401).send({ status: 401, message: "plan is required" })
    } else if (!req.body.created_by) {
      return res.status(401).send({ status: 401, message: "created_by is required" })
    }


    if (!mobile_no) {
      const create_client = await clients.create(clnt)
      res.status(200).send({
        data: create_client,
        password: cryptr.decrypt(create_client.password)
      })
      logger.info(`registration successfull`);
    } else {
      res.status(401).send({
        status: 401,
        message: "mobile_no already exits"
      })
    }

  } catch (error) {
    res.status(400).send({
      status: 400,
      message: error.message
    })
    logger.error(error.message);
  }

}

///////////////////////////////////////
///// .client login using mobile_no////
/////////////////////////////////////

const client_login = async (req, res, next) => {

  const m_client = await clients.findOne({ where: { mobile_no: req.body.mobile_no } });
  if (m_client) {
    const passwd = cryptr.decrypt(m_client.password);
    //const pass = await cryptr.compare(req.body.password, m_user.password);
    //const passwd = await clients.findOne({ where: { password: req.body.password } })

    if (passwd == req.body.password) {

      res.status(200).json({
        message: 'Logged In',

        id: m_client.id,
        clientname: m_client.username,
        mobile_no: m_client.mobile_no,
        //password: cryptr.decrypt(m_client.password),
        plan: m_client.plan,
        created_by: m_client.created_by
      });
      logger.info("Logged In");
    } else {
      res.status(400).json({
        status: 400,
        error: "Password Incorrect"
      });
      logger.error("Password Incorrect");
    }

  } else {
    res.status(404).json({ error: "User does not exist" });
    logger.error("User does not exist");
  }
}

/////////////////////////////////////////////////////////
//////////5.clients List from clients tables////////////
///////////////////////////////////////////////////////

const client_list = async (req, res) => {
  try {
    let created_by = req.body.created_by;

    let size = 10;
    let page = req.params.page;
    let offset = page * size;

    const clientdata = await db.sequelize.query("SELECT id,clientname,plan,created_by,mobile_no FROM client_tables where current_status != 'close' and created_by=:created_by limit :limit offset :offset", {
      type: QueryTypes.SELECT,
      replacements: { created_by: created_by, limit: size, offset: offset }


    });
    res.status(200).send({
      data: clientdata
    });
    logger.info(`success`);
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: error.message
    })
    logger.error(error.message);
  }
}

///////////////////////////////////////////////////////////
//////////6.select single client from client tables///////////
/////////////////////////////////////////////////////////

const single_client = async (req, res) => {
  try {
    let id = req.body.id;
    let created_by = req.body.created_by;

    let size = 10;
    let page = req.params.page;
    let offset = page * size;

    const singleclnt = await db.sequelize.query("SELECT c.id,c.clientname, c.mobile_no, c.address, c.plan, c.amount, c.created_by, COUNT(i.amount) as installment_no, c.createdAt FROM client_tables c INNER JOIN install_tables i ON i.client_id=c.id WHERE c.id=:id and c.created_by=:created_by", {
      type: QueryTypes.SELECT,
      replacements: { id: id, created_by: created_by }

    });
    const singleclnt_list = await db.sequelize.query("SELECT c.id,c.clientname, c.created_by, i.amount, i.i_date as installment_date FROM client_tables c INNER JOIN install_tables i ON i.client_id=c.id WHERE c.id=:id and c.created_by=:created_by limit :limit offset :offset", {
      type: QueryTypes.SELECT,
      replacements: { id: id, created_by: created_by, limit: size, offset: offset }

    });
    res.status(200).send({
      data: { singleclnt, singleclnt_list }
    });
    logger.info(`success`);
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: error.message
    })
    logger.error(error.message);
  }
}



///////////////////////////
///7.search client name///
/////////////////////////
const search_client = async (req, res) => {
  try {

    let searchname = {
      clientname: req.body.clientname,
      created_by :req.body.created_by
    }

    let fn = '%' + searchname.clientname + '%'

    const search_c = await db.sequelize.query("select id,clientname from client_tables where clientname LIKE :clientname and created_by=:created_by", {
      type: QueryTypes.SELECT,
      replacements: { clientname: fn, created_by:searchname.created_by }
    });
    // res.status(200).send(
    //   {
    //     data: search_c
    //   })
    // logger.info(`success`);

    if (search_c[0]!=null) {

      const searchdata = await db.sequelize.query("SELECT id,clientname, mobile_no, address,plan, amount FROM client_tables WHERE clientname LIKE :clientname and created_by=:created_by ", {
        type: QueryTypes.SELECT,
        replacements: { clientname: fn, created_by:searchname.created_by }
      });
      const instal_no = await db.sequelize.query("SELECT c.id,COUNT(i.amount) as installment_no FROM install_tables i, client_tables c WHERE c.id=i.client_id AND clientname LIKE :clientname and created_by=:created_by group by c.id ", {
        type: QueryTypes.SELECT,
        replacements: { clientname: fn, created_by:searchname.created_by }
      });

      if(instal_no[0]==null){

           res.status(401).send({
          message: "installment 0"
          })
      }else{
      res.status(200).send(
        {
          data: {searchdata,instal_no}
        })
      logger.info(`success`);
      }

      // if (searchdata[0].id!=null) {
      //   res.status(200).send(
      //     {
      //       data: searchdata
      //     })
      //   logger.info(`success`);
      // }else{
      //   res.status(401).send({
      //     status: 401,
      //     message: "error...its 1st installment"
      //     })

      // }

    }else{

      res.status(401).send({
      message: "error...client not exist"
      })

   }

  } catch (error) {
    res.status(400).send({
      status: 400,
      message: error.message
    })
    logger.error(error.message);
  }
}

//SELECT c.clientname, COUNT(c.installment_no)+1 as installment_no, i.user_id FROM client_tables c INNER JOIN install_tables i ON i.user_id=c.created_by WHERE c.clientname LIKE 'roy' and  c.id=1;

///////////////////////////////////////////////////////////
//////////8.update current status of client tables////////
/////////////////////////////////////////////////////////

const update_status_close = async (req, res) => {
  try {
    let id = req.body.id;
    //let current_status = req.body.current_status

    const updateclnt = await db.sequelize.query("update client_tables set current_status='close' where id=:id", {
      type: QueryTypes.UPDATE,
      replacements: { id: id }

    });
    res.status(200).send({
      data: updateclnt
    });
    logger.info(`success`);
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: error.message
    })
    logger.error(error.message);
  }
}

///////////////////////////////////////////////////////////
//////////8.update current status of client tables////////
/////////////////////////////////////////////////////////

const update_status_return = async (req, res) => {
  try {
    let id = req.body.id;
    //let current_status = req.body.current_status

    const updaterturn = await db.sequelize.query("update client_tables set current_status='return' where id=:id", {
      type: QueryTypes.UPDATE,
      replacements: { id: id }

    });
    res.status(200).send({
      data: updaterturn
    });
    logger.info(`success`);
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: error.message
    })
    logger.error(error.message);
  }
}

//////////////////////////////////////////////////////
////////9.insert installment number in list//////////
////////////////////////////////////////////////////

const ad_install = async (req, res) => {

  try {
    let instal_data = {
      user_id: req.body.user_id,
      client_id: req.body.client_id,
      amount: req.body.amount,
      i_date: req.body.i_date
    }
    const today = await instals.sequelize.query("select count(id) as cnt from install_tables where client_id=:client_id and i_date=:i_date", {
      type: QueryTypes.SELECT,
      replacements: { client_id: instal_data.client_id, i_date: instal_data.i_date }

    });
    //console.log(today);
    if (today[0].cnt == 0) {

      const instal_list = await instals.create(instal_data)
      res.status(200).send({
        data: instal_list
      })
      logger.info(`data added successfull`);

    } else {

      res.status(401).send({
        status: 401,
        message: " client already exits"
      })

    }
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: error.message
    })
    logger.error(error.message);
  }
}



//////////////////////////////////////////////////////////////////////////
/////10.Count clients List and total amount with common created_by///////
////////////////////////////////////////////////////////////////////////

const same_createdby = async (req, res) => {
  try {
    let user_id = req.body.user_id;
    let size = 10;
    let page = req.params.page;
    let offset = page * size;

    var client_c = await db.sequelize.query(" select count(id) as count from client_tables where created_by=:created_by AND current_status!='close' AND current_status!='return' limit :limit offset :offset", { 
      type: QueryTypes.SELECT,
      replacements: { created_by: user_id, limit: size, offset: offset }

    });
    var client_t = await db.sequelize.query(" select sum(amount) as total from install_tables where user_id=:user_id limit :limit offset :offset", {
      type: QueryTypes.SELECT,
      replacements: { user_id: user_id, limit: size, offset: offset }

    });
    //  var combined = Object.assign(...client_c,...client_t);
    res.status(200).send({
      data: Object.assign(...client_c,...client_t)
    });
    logger.info(`success`);
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: error.message
    })
    logger.error(error.message);
  }
}
//SELECT COUNT(i.client_id) as count, SUM(i.amount) as total FROM install_tables i, client_tables c WHERE c.id=i.client_id and i.user_id=:user_id AND c.current_status!='close' AND c.current_status!='return' limit :limit offset :offset
///////////////////////////////////////////////////////////////////////////
//////////11.users client with name,installment_no,amount,date////////////
/////////////////////////////////////////////////////////////////////////

const receipt_list = async (req, res) => {
  try {
    let user_id = req.body.user_id;
    let size = 10;
    let page = req.params.page;
    let offset = page * size;

    const rcpt = await db.sequelize.query("SELECT c.clientname, count(i.amount) as installment_no , i.amount,  i.i_date as created_on FROM install_tables i INNER JOIN client_tables c ON c.id=i.client_id WHERE i.user_id=:user_id group by c.clientname limit :limit offset :offset;", {
      type: QueryTypes.SELECT,
      replacements: { user_id: user_id, limit: size, offset: offset }


    });
    res.status(200).send({
      data: rcpt
    });
    logger.info(`success`);
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: error.message
    })
    logger.error(error.message);
  }
}


///////////////////////////////////////////////////////////
//////////12.installment list for client//////////////////
/////////////////////////////////////////////////////////

const install_client = async (req, res) => {
  try {
    let client_id = req.body.client_id;
    let size = 10;
    let page = req.params.page;
    let offset = page * size;

    const instlclnt = await db.sequelize.query("SELECT client_id,COUNT(amount) as installment FROM install_tables WHERE client_id=:client_id limit :limit offset :offset", {
      type: QueryTypes.SELECT,
      replacements: { client_id: client_id, limit: size, offset: offset }

    });
    res.status(200).send({
      data: instlclnt
    });
    logger.info(`success`);
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: error.message
    })
    logger.error(error.message);
  }
}

///////////////////////////////////////
///////// 13.Admin log in ////////////
/////////////////////////////////////

const admin_login = async (req, res, next) => {

  const admn = await user.findOne({ where: { mobile_no: req.body.mobile_no } });
  if (admn) {
    const ps = cryptr.decrypt(admn.password)
    // const pswd = await bcrypt.compare(req.body.password, admn.password);
    //const ps = await user.findOne({ where: { password: req.body.password } })

    if (ps == req.body.password) {

      res.status(200).json({
        message: 'Logged In',

        id: admn.id,
        username: admn.username,
        mobile_no: admn.mobile_no,
        //password: cryptr.decrypt(admn.password),
        user_type: admn.user_type,
        society: admn.society
      });
      logger.info("Logged In");
    } else {
      res.status(400).json({
        status: 400,
        error: "Password Incorrect"
      });
      logger.error("Password Incorrect");
    }

  } else {
    res.status(404).json({ error: "User does not exist" });
    logger.error("User does not exist");
  }
}

////////////////////////////////////////////////////////////////////
//////////14.list of users(staff) of a society for admin///////////
//////////////////////////////////////////////////////////////////

const admin_users = async (req, res) => {
  try {
    let society = req.body.society;
    let size = 10;
    let page = req.params.page;
    let offset = page * size;

    const scity = await db.sequelize.query("SELECT id,username,mobile_no,user_type,society FROM user_tables where user_type='staff' and society=:society limit :limit offset :offset", {
      type: QueryTypes.SELECT,
      replacements: { society: society, limit: size, offset: offset }

    });
    res.status(200).send({
      data: scity
    });
    logger.info(`success`);
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: error.message
    })
    logger.error(error.message);
  }
}

///////////////////////////////////////////////////////////
//////////15.closed a/c of clients////////////////////////
/////////////////////////////////////////////////////////

const closed_client = async (req, res) => {
  try {
    let user_id = req.body.user_id;
    let society = req.body.society;
    let size = 10;
    let page = req.params.page;
    let offset = page * size;

    const closelist = await db.sequelize.query("SELECT c.id,c.clientname, c.mobile_no, c.address, c.plan, c.amount, c.created_by, COUNT(i.amount) as installment_no, c.createdAt FROM client_tables c, install_tables i, user_tables u WHERE u.id=c.created_by AND c.id=i.client_id AND  c.current_status='close' AND i.user_id=:user_id AND u.society=:society GROUP BY c.clientname limit :limit offset :offset", {
      type: QueryTypes.SELECT,
      replacements: { user_id: user_id, society: society, limit: size, offset: offset }

    });
    res.status(200).send({
      data: closelist
    });
    logger.info(`success`);
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: error.message
    })
    logger.error(error.message);
  }
}

///////////////////////////////////////////////////////////
//////////16.return a/c of clients////////////////////////
/////////////////////////////////////////////////////////

const return_client = async (req, res) => {
  try {
    let user_id = req.body.user_id;
    let society = req.body.society;
    let size = 10;
    let page = req.params.page;
    let offset = page * size;

    const returnlist = await db.sequelize.query("SELECT c.id,c.clientname, c.mobile_no, c.address, c.plan, c.amount, c.created_by, COUNT(i.amount) as installment_no, c.createdAt FROM client_tables c, install_tables i, user_tables u WHERE u.id=c.created_by AND c.id=i.client_id AND  c.current_status='return' AND i.user_id=:user_id AND u.society=:society GROUP BY c.clientname limit :limit offset :offset ", {
      type: QueryTypes.SELECT,
      replacements: { user_id: user_id, society: society, limit: size, offset: offset }

    });
    res.status(200).send({
      data: returnlist
    });
    logger.info(`success`);
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: error.message
    })
    logger.error(error.message);
  }
}

/////////////////////////////////////////////////////////////////////
//////////15.closed a/c of clients for admin////////////////////////
///////////////////////////////////////////////////////////////////

const admin_closed_client = async (req, res) => {
  try {
    let society = req.body.society;
    let size = 10;
    let page = req.params.page;
    let offset = page * size;

    const closelist = await db.sequelize.query("SELECT c.id,c.clientname, c.mobile_no, c.address, c.plan, c.amount, c.created_by, COUNT(i.amount) as installment_no, c.createdAt FROM client_tables c, install_tables i, user_tables u WHERE u.id=c.created_by AND c.id=i.client_id AND c.current_status='close' AND u.society=:society GROUP BY c.clientname limit :limit offset :offset", {
      type: QueryTypes.SELECT,
      replacements: { society: society, limit: size, offset: offset }

    });
    res.status(200).send({
      data: closelist
    });
    logger.info(`success`);
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: error.message
    })
    logger.error(error.message);
  }
}

/////////////////////////////////////////////////////////////////////
//////////16.return a/c of clients for admin////////////////////////
///////////////////////////////////////////////////////////////////

const admin_return_client = async (req, res) => {
  try {
    let society = req.body.society;
    let size = 10;
    let page = req.params.page;
    let offset = page * size;

    const returnlist = await db.sequelize.query("SELECT c.id,c.clientname, c.mobile_no, c.address, c.plan, c.amount, c.created_by, COUNT(i.amount) as installment_no, c.createdAt FROM client_tables c, install_tables i, user_tables u WHERE u.id=c.created_by AND c.id=i.client_id AND c.current_status='return' AND u.society=:society GROUP BY c.clientname limit :limit offset :offset ", {
      type: QueryTypes.SELECT,
      replacements: { society: society, limit: size, offset: offset }

    });
    res.status(200).send({
      data: returnlist
    });
    logger.info(`success`);
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: error.message
    })
    logger.error(error.message);
  }
}

module.exports = {
  addUser,
  user_list,
  single_user,
  addclient,
  client_login,
  client_list,
  single_client,
  search_client,
  update_status_close,
  update_status_return,
  ad_install,
  same_createdby,
  receipt_list,
  install_client,
  admin_login,
  admin_users,
  staff_login,
  closed_client,
  return_client,
  admin_closed_client,
  admin_return_client
}