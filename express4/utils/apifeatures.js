class APIFeatures {
    constructor (query, queryString) {
        this.query = query
        this.queryString = queryString
    }

    filter () {
        const queryObj = {...this.queryString}
        const excludedFields = ['field', 'sort', 'page', 'limit']
        excludedFields.forEach((el) => delete queryObj[el])

        //ADVANCED FILTERING

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(
            /\b(lt|lte|gt|gte|in)\b/g,
            (match) => `$${match}`
        )

        let parsedQuery = JSON.parse(queryStr)

        if (parsedQuery.budgetName) {
            let formerbudgetName = parsedQuery.budgetName

            parsedQuery.$text = {
                $search : formerbudgetName,
                $caseSensitive : false
            }

            delete parsedQuery.budgetName
        }
        this.query = this.query.find(parsedQuery)

        return this
    }

    sort () {
        if (this.queryString.sort) {
            const sortList = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortList)
        }
        else {
            this.query = this.query.sort('budgetName')
        }
        return this
    }

    field () {
        if (this.queryString.field) {
            const fieldList = this.queryString.field.split(',').join(' ')
            this.query = this.query.select(fieldList)
        }
        return this
    }

    paginate () {
        const page = this.queryString.page || 1
        const limit = this.queryString.limit || 5
        const skip = (page - 1) * limit
        
        this.query = this.query.skip(skip).limit(limit)
        return this
    }
}

module.exports = APIFeatures