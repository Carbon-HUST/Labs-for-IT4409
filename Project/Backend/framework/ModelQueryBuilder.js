class ModelQueryBuilder {
    
    static buildProjectionQuery(obj) {
        return (obj._projections) ? obj._projections.map(field => `${obj.getTablename()}.${field}`).join(', ') : "*";
    }

    static buildWhereQuery(obj) {
        const args = [];
        let whereQuery = "1";
        if (obj._conditions && obj._conditions.length > 0) {
            const conditionExpressions = [];
            for (let condition of obj._conditions) {
                if (condition.operator === "BETWEEN" || condition.operator === "between") {
                    conditionExpressions.push(`${condition.attribute} ${condition.operator} ? AND ?`);
                    args.push(condition.value[0]);
                    args.push(condition.value[1]);
                } else {
                    conditionExpressions.push(`${condition.attribute} ${condition.operator} ?`);
                    args.push(condition.value);
                }
            }
            whereQuery = conditionExpressions.join(' AND ');
        }
        return {
            whereQuery,
            args
        }
    }

    static buildSelectQuery(obj) {
        const projectionQuery = this.buildProjectionQuery(obj);
        const {
            whereQuery,
            args
        } = this.buildWhereQuery(obj);

        let query = `SELECT ${projectionQuery} FROM ${obj.getTablename()} WHERE ${whereQuery} `;

        if (obj._orderBy && Object.keys(obj._orderBy).length > 0) {
            const orderByExpression = [];
            for (let field in obj._orderBy) {
                if (obj._orderBy[field] === 1) {
                    orderByExpression.push(`${field} ASC`);
                } else if (obj._orderBy[field] === -1) {
                    orderByExpression.push(`${field} DESC`);
                } else {
                    continue;
                }
            }
            query += `ORDER BY ${orderByExpression.join(', ')} `;
        }
        if (obj._limit) {
            query += `LIMIT ? `;
            args.push(obj._limit);
        }
        if (obj._skip) {
            query += `OFFSET ? `;
            args.push(obj._skip);
        }

        console.log(query);

        return {
            query,
            args
        }
    }

    static buildInsertQuery(newObj) {
        const properties = Object.keys(newObj.getAttributes());
        const insertFields = [];
        const placeHolders = [];
        const args = [];
        properties.forEach(property => {
            if (property !== 'id') {
                insertFields.push(property);
                placeHolders.push('?');
                args.push(newObj[property]);
            }
        });
        const query = `INSERT INTO ${newObj.getTablename()}(${insertFields.join(', ')}) VALUES(${placeHolders.join(', ')})`;
        return {
            query,
            args
        }
    }

    static buildUpdateQuery(obj, attrs) {
        let args = [];
        const {
            whereQuery,
            args: whereArgs
        } = this.buildWhereQuery(obj);

        const attrsKey = Object.keys(attrs);
        const setExpression = [];
        for (let key of attrsKey) {
            if (key === 'id' || !obj.getAttributes()[key])
                continue;
            setExpression.push(`${key} = ?`);
            args.push(attrs[key]);
        }

        args = args.concat(whereArgs);
        const query = `UPDATE ${obj.getTablename()} SET ${setExpression.join(', ')} WHERE ${whereQuery}`;
        console.log(query);
        console.log(args);
        return {
            query,
            args
        }
    }

    static buildDeleteQuery(obj) {
        const {
            whereQuery,
            args
        } = this.buildWhereQuery(obj);

        const query = `DELETE FROM ${obj.getTablename()} WHERE ${whereQuery}`;
        return {
            query,
            args
        }
    }
}

module.exports = ModelQueryBuilder;