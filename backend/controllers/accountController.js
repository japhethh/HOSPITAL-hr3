const accountService = require('../service/accountService')

// GET ALL ACCOUNTS
exports.getAccounts = async (req, res) => {
    try {
        const accounts = await accountService.findAccounts();
        res.status(200).send(accounts);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).send
    }
}


// UPDATE ACCOUNT
exports.updateAccount = async (req, res) => {
    try {
        const account = await accountService.updateAccount(req.params.id, req.body);
        res.status(200).json({ 
            success: true, 
            message: `Account Updated for ${account.username}`, 
            });

        req.io.emit('update-user', account)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

// DELETE ACCOUNT
exports.deleteAccount = async (req, res) => {
    try {
        const account = await accountService.deleteAccount(req.params.id);
        res.status(200).json({ 
            success: true, 
            message: `Account Deleted for ${account.username}`, 
            });

        req.io.emit('delete-user', account)  
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


