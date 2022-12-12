class APIFeatures {
    constructor (query, queryString) {
        this.query = query
        this.queryString = queryString
    }

    filter () {
        const queryObj = {...this.queryString} 
        const excludedFields = ["page", "sort", "limit", "field"]
        excludedFields.forEach((el) => delete queryObj[el])

        //1B ADVANCED FILTERING

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt|in)\b/g,
            (match) => `$${match}`
        );

        this.query = this.query.find(JSON.parse(queryStr))
        return this
    }

    sort () {
        thi
    }
}