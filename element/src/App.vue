<template>
  <div>
    <el-row>
      <el-button type="primary" style="float:right" @click="showDialog">新增</el-button>
    </el-row>
    <el-dialog title="新增集群" :visible.sync="dialogVisible" width="50%">
      <span>请选择集群类型：</span>
      <el-radio-group v-model="clusterType">
        <el-radio-button label="Mesos集群"></el-radio-button>
        <el-radio-button label="K8s集群"></el-radio-button>
      </el-radio-group>
      <el-divider></el-divider>
      <el-form v-if="clusterType === 'Mesos集群'" ref="form" :model="meosos" label-width="100px">
        <el-form-item label="集群名称">
          <el-input v-model="meosos.name"></el-input>
        </el-form-item>
        <el-form-item label="所在地区">
          <el-select v-model="meosos.region" placeholder="请选择地区">
            <el-option label="上海" value="上海"></el-option>
            <el-option label="南京" value="南京"></el-option>
            <el-option label="深圳" value="深圳"></el-option>
            <el-option label="西安" value="西安"></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="11">
            <el-form-item label="Master1">
              <el-input v-model="meosos.master1"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="Master1-IP">
              <el-input v-model="meosos.master1Ip"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="Master2">
              <el-input v-model="meosos.master2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="Master2-IP">
              <el-input v-model="meosos.master2Ip"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="Master3">
              <el-input v-model="meosos.master3"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="Master3-IP">
              <el-input v-model="meosos.master3Ip"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer" :model="meosos">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">提 交</el-button>
      </span>
    </el-dialog>

    <el-table :data="clusterData" style="width: 100%" stripe>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" class="demo-table-expand">
            <el-row>
              <el-form-item class="testStyle" label="Master1Ip">
                <span style="margin-left: 30px">{{ scope.row.master1Ip }}</span>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item class="testStyle" label="Master2Ip">
                <span style="margin-left: 30px">{{ scope.row.master2Ip }}</span>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item class="testStyle" label="Master3Ip">
                <span style="margin-left: 30px">{{ scope.row.master3Ip }}</span>
              </el-form-item>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="集群名" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="集群区域" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.region }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Master1" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.master1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Master2" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.master2 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Master3" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.master3 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 15, 20, 25]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      currentPage: 1,
      pageSize: 5,
      total: 10,
      dialogVisible: false,
      clusterData: [],
      clusterType: 'Mesos集群',
      flag: 'add',
      meosos: {
        name: '',
        region: '',
        master1: '',
        master2: '',
        master3: '',
        master1Ip: '',
        master2Ip: '',
        master3Ip: ''
      },
      k8s: {
        name: '',
        region: '',
        master1: '',
        master2: '',
        master3: '',
        master1Ip: '',
        master2Ip: '',
        master3Ip: ''
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$http.get('/api/cluster').then((response) => {
        console.log(response.body)
        const clusterData = response.body.data
        this.total = clusterData.length
        this.clusterData = clusterData.slice((this.currentPage - 1) * this.pageSize, (this.currentPage) * this.pageSize)
      }, (response) => {
        console.log(response)
      })
    },
    showDialog () {
      this.dialogVisible = true
      this.meosos = {}
    },
    onSubmit () {
      this.dialogVisible = false
      if (this.flag === 'add') {
        this.$http.post('/api/cluster', this.meosos).then((response) => {
          console.log(response)
        })
      } else {
        this.$http.put('/api/cluster', this.meosos).then((response) => {
          console.log(response)
        })
      }
      this.flag = 'add'
      this.init()
    },
    handleEdit (index, row) {
      this.dialogVisible = true
      this.meosos = row
      this.flag = 'update'
    },
    handleDelete (index, row) {
      this.meosos = row
      this.$http.delete('/api/cluster?name=' + row.name).then((response) => {
        console.log(response)
      })
      this.init()
    },
    handleSizeChange: function (size) {
      this.pageSize = size
      console.log(this.pageSize) // 每页下拉显示数据
      this.init()
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      console.log(this.currentPage) // 点击第几页
      this.init()
    }
  }
}
</script>

<style>
  .testStyle{
    color: #409EFF;
  }

  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #67C23A;
  }
</style>
