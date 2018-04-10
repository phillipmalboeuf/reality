
import { CONF } from '../../config'

export default class Model {

  static endpoint: string = 'models'

  public _id : string
  public attributes : any

  constructor(attributes: any) {
    this._id = attributes._id
    this.attributes = attributes
  }

  private static request(method: string, endpoint: string, data?: any) {
    return fetch(`${CONF('REALITY_SERVER')}/${this.endpoint}${endpoint}`, {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: data
    }).then(response => response.json())
  }

  static list() {
    return this.request('GET', '')
      .then(json => {
        return json.map((model: any)=> new this(model))
      })
  }

  public fetch() {
    return (this.constructor as typeof Model).request('GET', `/${this._id}`)
      .then(json => {
        this._id = json._id
        this.attributes = json
        return this
      })
  }

  public save(data: any) {
    return (this.constructor as typeof Model).request(this._id ? 'POST' : 'PUT', `${this._id ? `/${this._id}` : ''}`, data)
      .then(json => {
        this._id = json._id
        this.attributes = json
        return this
      })
  }

  public destroy() {
    return (this.constructor as typeof Model).request('DELETE', `/${this._id}`)
      .then(json => {
        this._id = undefined
        this.attributes = {}
        return this
      })
  }

}