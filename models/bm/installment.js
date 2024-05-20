module.exports = (sequelize, DataTypes) => {

    const instalnames = sequelize.define("install_tables", {

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        client_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        i_date: {
            type: DataTypes.DATE,
            allowNull: true
        }
      
    
    })
    
    return instalnames
    
    }