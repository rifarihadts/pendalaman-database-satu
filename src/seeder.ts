import dotenv from 'dotenv'
dotenv.config()

import {Customer} from './mongoose'

import ConnectDB from './connectDB'
import customers from './data/customers'


ConnectDB()
const customerModel = new Customer()

const importData = async () => {
    try {
        await customerModel.deleteMany()
        await customerModel.createMany(customers)

        console.log('Data imported')
        process.exit()
    } catch (error) {
        console.log(`${error}`)
        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        await customerModel.deleteMany()
        await customerModel.createMany(customers)

        console.log('Data destroyed')
        process.exit()
    } catch (error) {
        console.log(`${error}`)
        process.exit(1)
    }
}

if(process.argv[2] === '-d'){
    destroyData()
}
else{
    importData()
}

