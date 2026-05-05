class ApiFeatures {
    constructor(query,queryStr,allowedFields){
        this.query = query;
        this.queryStr = queryStr;
        this.allowedFields = allowedFields;
    }

    filter(){
        
        let qureyObj = {};

        for(let key in this.queryStr){

            const baseFields = key.split("[")[0];


            if(this.allowedFields.includes(baseFields)){
                const operatorMatched = key.match(/\[(gt|gte|lt|lte)\]/);
                const operator = `$${operatorMatched[1]}`;
                if(!qureyObj[baseFields]){
                    qureyObj[baseFields] = {};
                }
                qureyObj[baseFields][operator] = Number(this.queryStr[key]);
            }else{
                qureyObj[baseFields] = this.queryStr[key];
            }
        }

        
        this.query = this.query.find(qureyObj);
        return this;
    }

    search(){
        if(this.queryStr.search){
            const searchField = this.queryStr.field;
            const searchValue = this.queryStr.value;

            if(!searchField || searchField === "all"){
                this.query = this.query.find(
                    {
                        $text: {$search: searchValue}
                    }
                )
            }else{
                this.query = this.query.find({
                    [searchField]: {
                        $regex: searchValue,
                        $options: "i"
                    }
                })
            }


        }
        return this;
    }

    paginate(defaultLimit = 10){

        const page = parseInt(this.queryStr.page) || 1;
        const limit = parseInt(this.queryStr.limit) || defaultLimit;

        const skip = (page-1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;

    }


}

export {ApiFeatures}
