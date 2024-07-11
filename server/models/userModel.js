const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('userName', value.trim());
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('password', value.trim());
        }
    },
    isAdmin: {
        type: DataTypes.ENUM,
        values: [ 'admin', 'user' ],
        defaultValue: 'user'
    }
}, {
    timestamps: true, 
    hooks: {
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

User.prototype.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = User;
