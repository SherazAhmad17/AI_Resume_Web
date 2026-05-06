class ApiFeatures {
    constructor(query, queryStr, allowedFields) {
        this.query = query;
        this.queryStr = queryStr;
        this.allowedFields = allowedFields;
    }

    filter() {
        let queryObj = {};

        // 1. Fields we want to IGNORE in the database filter
        const excludedFields = ['page', 'limit', 'search', 'field', 'value'];

        for (let key in this.queryStr) {
            // Skip utility fields so they don't break the query
            if (excludedFields.includes(key)) continue;

            const baseFields = key.split("[")[0];

            if (this.allowedFields.includes(baseFields)) {
                const operatorMatched = key.match(/\[(gt|gte|lt|lte)\]/);

                // 2. Safely check if the regex actually found a match
                if (operatorMatched) {
                    const operator = `$${operatorMatched[1]}`;
                    if (!queryObj[baseFields]) {
                        queryObj[baseFields] = {};
                    }
                    queryObj[baseFields][operator] = Number(this.queryStr[key]);
                } else {
                    // If no [gt]/[lt] operator, just do an exact match
                    queryObj[baseFields] = this.queryStr[key];
                }
            }
        }

        this.query = this.query.find(queryObj);
        return this;
    }

    search() {
        if (this.queryStr.search) {
            const searchField = this.queryStr.field;

            // 3. Fallback to this.queryStr.search if 'value' isn't provided in the URL
            const searchValue = this.queryStr.value || this.queryStr.search;

            if (!searchField || searchField === "all") {
                this.query = this.query.find({
                    $text: { $search: searchValue }
                });
            } else {
                this.query = this.query.find({
                    [searchField]: {
                        $regex: searchValue,
                        $options: "i"
                    }
                });
            }
        }
        return this;
    }

    paginate(defaultLimit = 10) {
        const page = parseInt(this.queryStr.page) || 1;
        const limit = parseInt(this.queryStr.limit) || defaultLimit;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

export { ApiFeatures };