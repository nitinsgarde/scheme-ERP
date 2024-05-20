module.exports = (sequelize, DataTypes) => {

    const usernames = sequelize.define("user_tables", {
       
        username: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mobile_no: {
            type: DataTypes.STRING,
            allowNull: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true
        },
        user_type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        society: {
            type: DataTypes.STRING,
            allowNull: true
        }
      
    
    })
    
    return usernames
    
    }