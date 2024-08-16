<template>
  <div class="row">
    <div class="col-md-4 col-padding">
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-4" style="margin: 4px 0;">公司資料</div>
            <div class="col-8" style="text-align: right">
              <el-button-group>
                <el-button type="buttonSave" @click="createCompany('Insert')" icon="el-icon-plus" size="mini" circle></el-button>
                <el-button type="success" icon="el-icon-search" size="mini" circle @click="dlgQueryC = true"></el-button>
                <!--刪除收合按鈕-->
              </el-button-group>
            </div>
          </div>
        </div>

        <!--Tab1 start-->
        <el-tabs v-model="activeName1" type="card">
          <!--Tab1 button-->
          <el-tab-pane label="用戶管理" name="first">
            <!--Tab1 content-->
            <el-form :model="company" :rules="compRules" ref="company" :label-position="'left'" label-width="80px">
              <el-form-item label="公司代碼" prop="CompCode">
                <el-input v-model="company.CompCode" :disabled="company.ID !=''" clearable></el-input>
              </el-form-item>
              <el-form-item label="公司名稱" prop="Name">
                <el-input v-model="company.Name" clearable></el-input>
              </el-form-item>
              <el-form-item label="公司縮寫" prop="Abbreviation">
                <el-input v-model="company.Abbreviation" clearable></el-input>
              </el-form-item>
              <el-form-item label="管理人">
                <el-select v-model="company.Manager" placeholder="請選擇管理人" clearable>
                  <el-option v-for="item in employeeList" :key="item.ID" :label="item.Name" :value="item.EmpNo">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="電子郵件" prop="Email">
                <el-input v-model="company.Email" clearable></el-input>
              </el-form-item>
              <el-form-item label="郵遞區域" prop="PostalCode">
                <el-input v-model="company.PostalCode" clearable></el-input>
              </el-form-item>
              <el-form-item label="地址" prop="Address">
                <el-input v-model="company.Address" clearable></el-input>
              </el-form-item>
              <el-form-item label="傳真" prop="Fax">
                <el-input v-model="company.Fax" clearable></el-input>
              </el-form-item>
              <el-form-item label="電話1" prop="Phone1">
                <el-input v-model="company.Phone1" clearable></el-input>
              </el-form-item>
              <el-form-item label="電話2" prop="Phone2">
                <el-input v-model="company.Phone2" clearable></el-input>
              </el-form-item>
              <el-form-item label="網址" prop="Url">
                <el-input v-model="company.Url" clearable></el-input>
              </el-form-item>
              <el-form-item label="公司狀態">
                <el-select size="medium" v-model="company.Status" placeholder="狀態">
                  <el-option v-for="option in statusOptions" :key="option.value" :label="option.label" :value="option.value"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div class="row">
              <div class="col-12" style="text-align: right;">
                <actionComponent :loadingText="loadingText" @deleteEvent="deleteAll" @saveEvent="save"></actionComponent>
              </div>
            </div>
          </el-tab-pane>

          <!--Tab1 button2-->
          <el-tab-pane label="配置管理" name="second">
            <!--Tab1 content2-->
            <el-form :model="company" :rules="compRules" ref="company" :label-position="'left'" label-width="80px">
              <el-form-item label="公司代碼" prop="CompCode">
                <el-input v-model="company.CompCode" :disabled="company.ID !=''" clearable></el-input>
              </el-form-item>
              <el-form-item label="公司名稱" prop="Name">
                <el-input v-model="company.Name" clearable></el-input>
              </el-form-item>
              <el-form-item label="公司縮寫" prop="Abbreviation">
                <el-input v-model="company.Abbreviation" clearable></el-input>
              </el-form-item>
              <el-form-item label="管理人">
                <el-select v-model="company.Manager" placeholder="請選擇管理人" clearable>
                  <el-option v-for="item in employeeList" :key="item.ID" :label="item.Name" :value="item.EmpNo">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="電子郵件" prop="Email">
                <el-input v-model="company.Email" clearable></el-input>
              </el-form-item>
              <el-form-item label="郵遞區域" prop="PostalCode">
                <el-input v-model="company.PostalCode" clearable></el-input>
              </el-form-item>
              <el-form-item label="地址" prop="Address">
                <el-input v-model="company.Address" clearable></el-input>
              </el-form-item>
              <el-form-item label="傳真" prop="Fax">
                <el-input v-model="company.Fax" clearable></el-input>
              </el-form-item>
              <el-form-item label="電話1" prop="Phone1">
                <el-input v-model="company.Phone1" clearable></el-input>
              </el-form-item>
              <el-form-item label="電話2" prop="Phone2">
                <el-input v-model="company.Phone2" clearable></el-input>
              </el-form-item>
              <el-form-item label="網址" prop="Url">
                <el-input v-model="company.Url" clearable></el-input>
              </el-form-item>
              <el-form-item label="公司狀態">
                <el-select size="medium" v-model="company.Status" placeholder="狀態">
                  <el-option v-for="option in statusOptions" :key="option.value" :label="option.label" :value="option.value"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <!--tab1 end-->
        <div class="row">
          <div class="col-12" style="text-align: right;">
            <actionComponent :loadingText="loadingText" @deleteEvent="deleteAll" @saveEvent="save"></actionComponent>
          </div>
        </div>

      </el-card>
    </div>
    <div class="col-md-8 col-padding">
      <el-card>
        <!--左右欄狀況下 右側el-card使用此div-->
        <div class="table-right-topspace">
          <!--Tab2 start v-modle名稱需與tab1不相同-->
          <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
            <!--Tab2 button1-->
            <el-tab-pane label="用戶管理" name="first">
              <!--Tab2 content1 錶格右上方新增按鈕請使用此div-->
              <div class="table-right-button" style="text-align: right">
                <el-button-group>
                  <el-button type="buttonSave" @click="createCompany('Insert')" icon="el-icon-plus" size="mini" circle></el-button>
                </el-button-group>
              </div>
              <!--columns="table.head 不同Tab中的錶格請於script部分新增 相同錶格存在不同Tab中會有bug-->
              <data-table v-if="table !== null" v-model="selectedRows" :selectionMode="'Single'" :columns="table.head" :data="departList" :orderIndex=1 :orderBy="'desc'" :reSetting="reSetA"></data-table>
            </el-tab-pane>
            <!--Tab2 button2-->
            <el-tab-pane label="配置管理" name="second">
              <!--Tab2 content2 錶格右上方新增按鈕請使用此div-->
              <div class="table-right-button" style="text-align: right">
                <el-button-group>
                  <el-button type="buttonSave" @click="createCompany('Insert')" icon="el-icon-plus" size="mini" circle></el-button>
                </el-button-group>
              </div>
              <!--columns="table.head2-->
              <data-table v-if="table !== null" v-model="selectedRows" :selectionMode="'Single'" :columns="table2.head" :data="departList" :orderIndex=1 :orderBy="'desc'" :reSetting="reSetB"></data-table>
            </el-tab-pane>
          </el-tabs>
        </div>
        <!--div class table-right-topspace end-->
      </el-card>
    </div>

    <el-dialog :visible.sync="dlgQueryC" width="80%" :close-on-click-modal="false">
      <queryCompanyComponent :reloading="dlgQueryC" :returnType="'Single'" v-model="selectedCompRows">
        <el-button slot="actionBtn" type="primary" @click="setCompany">
          <i class="el-icon-back">&nbsp;</i>帶入
        </el-button>
      </queryCompanyComponent>
    </el-dialog>

    <el-dialog title="部門資料維護" :visible.sync="dlgEditD" width="60%" :close-on-click-modal="false">
      <div class="row">
        <el-form :model="department" :rules="deptRules" ref="department" :label-position="'left'" label-width="80px">
          <div class="row col-md-12">
            <div class="col-md-6">
              <el-form-item label="部門代碼" prop="DeptCode">
                <el-input v-model="department.DeptCode" :disabled="displayNext != 'inline'" clearable></el-input>
              </el-form-item>
            </div>
            <div class="col-md-6">
              <el-form-item label="部門名稱" prop="Name">
                <el-input v-model="department.Name" clearable></el-input>
              </el-form-item>
            </div>
            <div class="col-md-6">
              <el-form-item label="部門縮寫" prop="Abbreviation">
                <el-input v-model="department.Abbreviation" clearable></el-input>
              </el-form-item>
            </div>
            <div class="col-md-6">
              <el-form-item label="母部門碼">
                <el-select v-model="department.ParentCode" clearable>
                  <el-option v-for="item in departList" :key="item.ID" :label="item.Name" :value="item.DeptCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-md-6">
              <el-form-item label="主管編號">
                <el-select v-model="department.Director">
                  <el-option v-for="item in deptEmployeeList" :key="item.EmpNo" :label="item.Name" :value="item.EmpNo">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-md-6">
              <el-form-item label="部門型態">
                <el-select v-model="department.DeptType" placeholder="請選擇部門型態">
                  <el-option v-for="option in deptType" :key="option.value" :label="option.label" :value="option.value"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-md-6">
              <el-form-item label="部門狀態">
                <el-select v-model="department.Status">
                  <el-option v-for="option in statusOptions" :key="option.value" :label="option.label" :value="option.value"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <div class="col-12" style="text-align: right">
        <el-button size="small" type="buttonNext" @click="createNextDept()" :style="{ display: displayNext }">下一筆</el-button>
        <el-button size="small" type="buttonSave" @click="saveDept()">儲存</el-button>
        <el-button size="small" type="warning" @click="deleteDept()" :style="{ display: displayDelete }">刪除</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import store from '@/store';
  import FormAction from '@/components/Control/FormAction';
  import datatable from '@/components/Control/DataTable';
  import ADM010101Q from '@/components/ADM01/ADM0101/ADM010101Q';
  import {
    getDepartmentList,
    getEmployeeList,
    postCompanyAndDepartment
  } from '@/assets/js/iFarmer/manager/OrganizationManager';
  import { getStatus, getDeptType } from '@/assets/js/iFarmer/library/optionLib';
  import { getCompany } from '@/assets/js/iFarmer/model/company.js';
  import { getDepartment } from '@/assets/js/iFarmer/model/department.js';
  import { command } from '@/assets/js/iFarmer/enum/command.js';

  export default {
    data: function() {
      return {
        activeName1: 'first',
        activeName2: 'first',
        empNo: this.$store.getters.userProfile.AccountNo,
        dlgQueryC: false,
        dlgEditD: false,
        loadingText: null,
        reSetA: false,
        reSetB: false,
        statusOptions: getStatus(),
        deptType: getDeptType(),
        company: getCompany(),
        department: {},
        departList: [],
        tmpDepartList: [],
        employeeList: [],
        selectedRows: [],
        selectedCompRows: [],
        transactionList: [],
        displayNext: 'inline',
        displayDelete: 'None',
        table: {
          /*不同錶格1*/
          head: [
            {
              title: '部門碼1',
              data: 'DeptCode'
            },
            {
              title: '部門型態',
              data: 'DeptTypeLabel'
            },
            {
              title: '公司碼',
              data: 'CompCode'
            },
            {
              title: '母部門碼',
              data: 'ParentCode'
            },
            {
              title: '部門名稱',
              data: 'Name'
            },
            {
              title: '部門縮寫',
              data: 'Abbreviation'
            },
            {
              title: '部門狀態',
              data: 'StatusLabel'
            },
            {
              title: '部門主管',
              data: 'Director'
            }
          ]
        },
        /*不同錶格2*/
        table2: {
          head: [
            {
              title: '部門碼2',
              data: 'DeptCode'
            },
            {
              title: '部門型態',
              data: 'DeptTypeLabel'
            },
            {
              title: '公司碼',
              data: 'CompCode'
            },
            {
              title: '母部門碼',
              data: 'ParentCode'
            },
            {
              title: '部門名稱',
              data: 'Name'
            },
            {
              title: '部門縮寫',
              data: 'Abbreviation'
            },
            {
              title: '部門狀態',
              data: 'StatusLabel'
            },
            {
              title: '部門主管',
              data: 'Director'
            }
          ]
        },

        deptRules: {
          DeptCode: [
            {
              required: true,
              message: '請輸入部門碼',
              trigger: 'blur'
            },
            {
              max: 36,
              message: '部門碼不得大於36個字',
              trigger: 'blur'
            }
          ],
          DeptType: [
            {
              required: true,
              message: '請選擇部門型態',
              trigger: 'blur'
            }
          ],
          Name: [
            {
              max: 20,
              message: '部門名稱不得大於20個字',
              trigger: 'blur'
            }
          ],
          Abbreviation: [
            {
              max: 20,
              message: '部門縮寫不得大於20個字',
              trigger: 'blur'
            }
          ]
        },
        compRules: {
          CompCode: [
            {
              required: true,
              message: '請輸入公司碼',
              trigger: 'blur'
            },
            {
              max: 36,
              message: '公司碼不得大於36個字',
              trigger: 'blur'
            }
          ],
          Name: [
            {
              max: 50,
              message: '公司名稱不得大於50個字',
              trigger: 'blur'
            }
          ],
          Abbreviation: [
            {
              max: 20,
              message: '公司縮寫不得大於20個字',
              trigger: 'blur'
            }
          ],
          Email: [
            {
              max: 50,
              message: '電子郵件不得大於50個字',
              trigger: 'blur'
            },
            {
              type: 'email',
              message: '電子郵件格式錯誤',
              trigger: 'blur'
            }
          ],
          PostalCode: [
            {
              max: 6,
              message: '郵遞區域不得大於6個字',
              trigger: 'blur'
            }
          ],
          Address: [
            {
              max: 100,
              message: '地址不得大於100個字',
              trigger: 'blur'
            }
          ],
          Fax: [
            {
              max: 20,
              message: '傳真不得大於20個字',
              trigger: 'blur'
            }
          ],
          Phone1: [
            {
              max: 20,
              message: '電話2不得大於20個字',
              trigger: 'blur'
            }
          ],
          Phone2: [
            {
              max: 20,
              message: '網址不得大於20個字',
              trigger: 'blur'
            }
          ],
          Url: [
            {
              max: 100,
              message: '公司名稱不得大於100個字',
              trigger: 'blur'
            }
          ]
        }
      };
    },
    methods: {
      showAlert(type, msg) {
        var vueInstance = this;
        if (type)
          vueInstance.$notify.success({
            title: '提示',
            message: msg
          });
        else
          vueInstance.$notify.warning({
            title: '警告',
            message: msg
          });
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },

      setCompany() {
        var vueInstance = this;
        if (vueInstance.selectedCompRows.length > 0) {
          delete vueInstance.selectedCompRows[0].StatusLabel;
          vueInstance.company = vueInstance.selectedCompRows[0];
          vueInstance.company.ModifiedUserID = vueInstance.empNo;
          vueInstance.selectedCompRows = [];
          vueInstance.getDept({
            compCode: vueInstance.company.CompCode
          });
          vueInstance.getEmployee({
            compCode: vueInstance.company.CompCode
          });
          vueInstance.dlgQueryC = false;
        }
      },
      getDept(filter) {
        var vueInstance = this;
        getDepartmentList(filter, function(response) {
          if (response.IsSuccess) {
            vueInstance.departList = response.Data;
            vueInstance.setOptionValue(vueInstance.departList);
            getEmployeeList(filter, function(response) {
              vueInstance.employeeList = response.Data;
            });
          } else vueInstance.showAlert(false, response.ExceptionMessage);
        });
      },
      getEmployee(filter) {
        var vueInstance = this;
        getEmployeeList(filter, function(response) {
          vueInstance.employeeList = response.Data;
        });
      },
      createCompany() {
        var vueInstance = this;
        vueInstance.initValue();
      },
      initValue() {
        var vueInstance = this;
        vueInstance.company = getCompany();
        vueInstance.company.CreatedUserID = vueInstance.empNo;
        vueInstance.departList = [];
        vueInstance.transactionList = [];
        vueInstance.employeeList = [];
        vueInstance.$refs['company'].resetFields();
      },
      setOptionValue(selectList) {
        var vueInstance = this;
        for (var index = 0; index < selectList.length; index++) {
          if (selectList[index].Status == 0)
            vueInstance.$set(selectList[index], 'StatusLabel', '停用');
          else if (selectList[index].Status == 1)
            vueInstance.$set(selectList[index], 'StatusLabel', '啓用');

          if (selectList[index].DeptType == 0)
            vueInstance.$set(selectList[index], 'DeptTypeLabel', '一般');
          else if (selectList[index].DeptType == 1)
            vueInstance.$set(selectList[index], 'DeptTypeLabel', '業務中心');
          else if (selectList[index].DeptType == 2)
            vueInstance.$set(selectList[index], 'DeptTypeLabel', '成本中心');
        }
      },
      editDept() {
        var vueInstance = this;
        if (vueInstance.selectedRows.length === 0) {
          vueInstance.displayNext = 'inline';
          vueInstance.displayDelete = 'None';
          vueInstance.department = getDepartment();
          vueInstance.tmpDepartList = [];
        } else {
          vueInstance.displayNext = 'None';
          vueInstance.displayDelete = 'inline';
          vueInstance.department = vueInstance.selectedRows[0];
        }
        vueInstance.dlgEditD = true;
      },
      createNextDept() {
        var vueInstance = this;
        vueInstance.$refs['department'].validate(valid => {
          if (valid) {
            vueInstance.tmpDepartList.push(vueInstance.department);
            vueInstance.department = getDepartment();
          }
        });
      },
      saveDept() {
        var vueInstance = this;
        vueInstance.$refs['department'].validate(valid => {
          if (valid) {
            if (vueInstance.displayNext === 'inline') {
              vueInstance.tmpDepartList.push(vueInstance.department);
              vueInstance.setOptionValue(vueInstance.tmpDepartList);
              vueInstance.tmpDepartList.forEach(element => {
                element.CompCode = vueInstance.company.CompCode;
                element.CreatedUserID = vueInstance.empNo;
                vueInstance.addTransactionList('dept', command.Create, element);
                vueInstance.departList.push(element);
              });
            } else {
              vueInstance.setOptionValue([vueInstance.department]);
              vueInstance.department.ModifiedUserID = vueInstance.empNo;
              vueInstance.addTransactionList(
                'dept',
                command.Update,
                vueInstance.department
              );
              let tmp = $.grep(vueInstance.departList, function(r) {
                return r.DeptCode === vueInstance.department.DeptCode;
              });
              vueInstance.departList.splice(
                vueInstance.departList.indexOf(tmp[0]),
                1,
                vueInstance.department
              );
            }
            vueInstance.dlgEditD = false;
            vueInstance.selectedRows = [];
          }
        });
      },
      deleteDept() {
        var vueInstance = this;
        vueInstance.addTransactionList(
          'dept',
          command.Delete,
          vueInstance.department
        );
        let tmp = $.grep(vueInstance.departList, function(r) {
          return (
            r.ID === vueInstance.department.ID &&
            r.DeptCode === vueInstance.department.DeptCode
          );
        });
        if (tmp.length > 0)
          vueInstance.departList.splice(
            vueInstance.departList.indexOf(tmp[0]),
            1
          );
        vueInstance.dlgEditD = false;
        vueInstance.selectedRows = [];
      },
      addTransactionList(name, action, entity) {
        var vueInstance = this;
        let trans = {};
        vueInstance.$set(trans, 'ID', entity.ID);
        vueInstance.$set(trans, 'SeqNo', vueInstance.transactionList.length + 1);
        vueInstance.$set(trans, 'Name', name);
        vueInstance.$set(trans, 'Command', action);
        vueInstance.$set(trans, 'Entity', entity);

        if (action == command.Create) vueInstance.transactionList.push(trans);
        else if (action == command.Update) {
          let tmp = $.grep(vueInstance.transactionList, function(r) {
            return r.Entity.DeptCode === entity.DeptCode;
          });
          if (tmp.length > 0) tmp[0].Entity = entity;
          else vueInstance.transactionList.push(trans);
        } else {
          let tmp = $.grep(vueInstance.transactionList, function(r) {
            return (
              r.Entity.ID === entity.ID && r.Entity.DeptCode === entity.DeptCode
            );
          });
          if (tmp.length > 0)
            vueInstance.transactionList.splice(
              vueInstance.transactionList.indexOf(tmp[0]),
              1
            );
          if (entity.ID != '') {
            vueInstance.$set(trans, 'Entity', entity.ID);
            vueInstance.transactionList.push(trans);
          }
        }
      },
      save() {
        var vueInstance = this;
        vueInstance.$refs['company'].validate(valid => {
          if (valid) {
            vueInstance.loadingText = '資料處理中';
            vueInstance.transactionList.forEach(element => {
              delete element.Entity.DeptTypeLabel;
              delete element.Entity.StatusLabel;
            });
            vueInstance.transactionList.unshift({
              ID: vueInstance.company.ID,
              SeqNo: 0,
              Name: 'comp',
              Command:
                vueInstance.company.ID != '' ? command.Update : command.Create,
              Entity: vueInstance.company
            });
            postCompanyAndDepartment(vueInstance.transactionList, function(
              response
            ) {
              vueInstance.loadingText = null;
              if (response.IsSuccess) {
                vueInstance.initValue();
                vueInstance.showAlert(true, '資料儲存成功');
              } else {
                vueInstance.setOptionValue(vueInstance.departList);
                vueInstance.showAlert(false, response.ExceptionMessage);
              }
            });
          }
        });
      },
      deleteAll() {
        var vueInstance = this;
        if (vueInstance.company.ID != '') {
          vueInstance.loadingText = '資料處理中';
          vueInstance.departList.forEach(element => {
            vueInstance.addTransactionList('dept', command.Delete, element);
          });
          vueInstance.transactionList.unshift({
            ID: vueInstance.company.ID,
            SeqNo: 0,
            Name: 'comp',
            Command: command.Delete,
            Entity: vueInstance.company.ID
          });
          postCompanyAndDepartment(vueInstance.transactionList, function(
            response
          ) {
            vueInstance.loadingText = null;
            if (response.IsSuccess) {
              vueInstance.initValue();
              vueInstance.showAlert(true, '資料刪除成功');
            } else {
              vueInstance.showAlert(false, response.ExceptionMessage);
            }
          });
        } else vueInstance.initValue();
      }
    },
    computed: {
      deptEmployeeList() {
        var vueInstance = this;
        return vueInstance.employeeList.filter(function(item) {
          return item.DeptCode === vueInstance.department.DeptCode;
        });
      }
    },
    watch: {
      activeName2: function() {
        var vueInstance = this;
        if (vueInstance.activeName2 == 'first') {
          vueInstance.reSetA = false;
          vueInstance.reSetB = true;
        } else {
          vueInstance.reSetA = false;
          vueInstance.reSetB = true;
        }
      }
    },
    components: {
      'queryCompanyComponent': ADM010101Q,
      'actionComponent': FormAction,
      'data-table': datatable
    }
  };
</script>
