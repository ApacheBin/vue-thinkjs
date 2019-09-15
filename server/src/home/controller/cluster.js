'use strict';
/**
 * rest controller
 * @type {Class}
 */
export default class extends think.controller.rest {
  /**
   * init
   * @param  {Object} http []
   * @return {}      []
   */
  init(http){
    super.init(http);
  }
  /**
   * before magic method
   * @return {Promise} []
   */
  __before(){

  }

  async getAction(){
    let model = this.model('cluster');
    let data = await model.select();
    return this.success(data);
  }

  async postAction(){
    let data = this.post();
    let model = this.model('cluster');
    let insertId = await model.add(data);
    return this.success({id: insertId});
  }

  async putAction(){
    let data = this.post();
    console.log(data);
    if (think.isEmpty(data)) {
      return this.fail('data is empty');
    }
    if (!data.name) {
      return this.fail('params error');
    }
    let model = this.model('cluster');
    // await model.where({name: data.name}).delete();
    let rows = await model.where({name: data.name}).update(data);
    return this.success({affectedRows: rows});
  }

  async deleteAction(){
    let name = this.get('name');
    console.log(name);
    if (think.isEmpty(name)) {
      return this.fail('name is empty');
    }
    let model = this.model('cluster');
    let rows = await model.where({name: name}).delete();
    return this.success({affectedRows: rows});
  }
}
