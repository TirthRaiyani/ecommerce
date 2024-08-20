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
            // Hash the password directly in the setter
            const salt = bcrypt.genSaltSync(10);
            this.setDataValue('password', bcrypt.hashSync(value.trim(), salt));
        }
    },
    isAdmin: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user'
    }
}, {
    timestamps: true,
});

User.prototype.isPasswordCorrect = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = User;
