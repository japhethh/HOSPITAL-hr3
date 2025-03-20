const accountRecords = require('../models/UserData')
const bcrypt = require('bcryptjs');

// FIND ALL ACCOUNTS
exports.findAccounts = async () => {
    const result = await accountRecords.find({})
    return result
}

// UPDATE ACCOUNT
exports.updateAccount = async (id, data) => {
    const result = await accountRecords.findById(id)
    if (!result) throw new Error('Account not found')

    if(data.password === result.password){
        const updatedAccount = await accountRecords.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        })
        return updatedAccount
    }

    if(data.password === ""){
        throw new Error('Password is required')
    }
    
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const updatedAccount = await accountRecords.findByIdAndUpdate
    (id, {...data, password: hashedPassword}, {
        new: true,
        runValidators: true
    })
    return updatedAccount
}

// DELETE ACCOUNT
exports.deleteAccount = async (id) => {
    const result = await accountRecords.findById(id)
    if (!result) throw new Error('Account not found')
    const deletedUser = await accountRecords.findByIdAndDelete(id)
    return deletedUser
}