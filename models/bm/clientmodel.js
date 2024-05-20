module.exports = (sequelize, DataTypes) => {

    const clientnames = sequelize.define("client_tables", {
       
        clientname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        installment_no: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        amount: {
            type: DataTypes.INTEGER,
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
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        plan: {
            type: DataTypes.STRING,
            allowNull: true
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        ref_by: {
            type: DataTypes.STRING,
            allowNull: true
        },
        current_status: {
            type: DataTypes.STRING,
            allowNull: true
        }

      
    
    })
    
    return clientnames
    
    }