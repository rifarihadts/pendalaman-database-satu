import mongoose from 'mongoose'
import customers from './data/customers';

export type CustomerType = {
    first_name : string
    last_name: string
    age:number
    customer_type:string
    street : string
    city: string
    state: string
    zip_code: string
    phone_number : string
}

export type CustomerDocument = mongoose.Document & CustomerType


type Keyword = {
    first_name : 
    {
        $regex: string,
        $options: 'i',
    }
} | {}

const CustomerSchema = new mongoose.Schema({
    first_name : String,
    last_name: String,
    age:Number,
    customer_type:String,
    street : String,
    city: String,
    state: String,
    zip_code: String,
    phone_number : String
},{
    timestamps: true
  }
)

export class Customer {
    private model: mongoose.Model<CustomerDocument>

    constructor() {
        this.model = mongoose.model('Customer', CustomerSchema);
    }

    async create(data:CustomerType) {
        try {
            const result = await this.model.create(data)
            console.log(result)
            return result
        } catch (error) {
            throw error
        }
    }

    async createMany(data: CustomerType[]) {
        try {
            const result = await this.model.insertMany(data)
            console.log(result)
            return result
        } catch (error) {
            throw error
        }
    }

    async getAll(limit:number){
        let result : CustomerType[]
        try {
            result = await this.model.aggregate([{
                "$addFields": {
                    "fullname" : {"$concat": ["$first_name", " ", "$last_name"] }
                }    
            }]).limit(limit).exec()

            return result
        } catch (error) {
            throw error
        }
    }

    async getByName(name: Keyword) {
        let result: CustomerType[]
        try {
            result = await this.model.find({...name})
        } catch (error) {
            throw error
        }

        return result
    }

    async getByType(type: string){
        let result: CustomerType[]
        try {
            result = await this.model.aggregate([
                {
                $match :{
                    customer_type: {
                        $eq: type
                    }
                }
            }
            ]).exec()
            return result
        } catch (error) {
            throw Error
        }
    }

    async getByState(state: string){
        let result: CustomerType[]
        try {
            result = await this.model.aggregate([
                {
                $match :{
                    state: {
                        $eq: state
                    }
                }
            }
            ]).exec()
            return result
        } catch (error) {
            throw Error
        }
    }

    async getByAge(age:number){
        let result: CustomerType[]
        try {
            result = await this.model.aggregate([
                {
                $match :{
                    age: {
                        $lt: age
                    }
                }
            }
            ]).exec()
            return result
        } catch (error) {
            throw Error
        }
    }

    async deleteMany() {
        try {
            await this.model.deleteMany({})
        } catch (error) {
            throw error
        }
    }
}