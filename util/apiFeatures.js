const ALLOWED_OPERATORS = ['gte', 'gt', 'lte', 'lt']
const RESERVED_FIELDS = ['page', 'sort', 'limit', 'fields']
const MAX_LIMIT = 100

class ApiFeatures {
  constructor(query, queryString, defaultSort = '-createdAt') {
    this.query = query
    this.queryString = queryString
    this.defaultSort = defaultSort
  }

  // Express 5 usa el query parser "simple": ?price[gte]=200 llega como
  // { 'price[gte]': '200' }, no como objeto anidado. Aquí lo convertimos
  // a { price: { $gte: '200' } } y solo aceptamos operadores permitidos,
  // para que nadie pueda inyectar operadores de MongoDB ($ne, $where, etc.).
  filter() {
    const filterObj = {}

    for (const [key, value] of Object.entries(this.queryString)) {
      if (RESERVED_FIELDS.includes(key) || typeof value !== 'string') continue

      const match = key.match(/^(\w+)\[(\w+)\]$/)
      if (match) {
        const [, field, operator] = match
        if (!ALLOWED_OPERATORS.includes(operator)) continue
        filterObj[field] = { ...filterObj[field], [`$${operator}`]: value }
      } else if (/^\w+$/.test(key)) {
        filterObj[key] = value
      }
    }

    this.query = this.query.find(filterObj)
    return this
  }

  sort() {
    const sortBy = this.queryString.sort
      ? this.queryString.sort.split(',').join(' ')
      : this.defaultSort
    this.query = this.query.sort(sortBy)
    return this
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ')
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select('-__v')
    }
    return this
  }

  pagination() {
    const page = Math.max(this.queryString.page * 1 || 1, 1)
    const limit = Math.min(Math.max(this.queryString.limit * 1 || MAX_LIMIT, 1), MAX_LIMIT)
    const skip = (page - 1) * limit
    this.query = this.query.skip(skip).limit(limit)
    return this
  }
}

export default ApiFeatures
