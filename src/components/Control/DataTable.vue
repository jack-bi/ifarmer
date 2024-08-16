<template>
  <table class="display nowrap table responsive nowrap table-bordered" cellspacing="0" style="width: 100%;">
  </table>
</template>

<script>
  module.exports = {
    model: {
      prop: "selectedItems",
      event: "change"
    },
    props: {
      selectedItems: {
        type: Array,
        default: function () {
          return [];
        }
      },
      columns: {
        type: Array,
        default: function () {
          return [];
        }
      },
      data: {
        type: Array,
        default: function () {
          return [];
        }
      },
      selectionMode: {
        type: String,
        default: function () {
          return "multiple";
        }
      },
      orderIndex: {
        type: Number,
        default: function () {
          return 1;
        }
      },
      orderBy: {
        type: String,
        default: function () {
          return "ASC";
        }
      },
      isReadOnly: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      reSetting: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      linkColumn: {
        type: String,
        default: function () {
          return undefined
        }
      }
    },
    data: function () {
      return {
        tableInstance: null,
        tableColumns: null
      }
    },
    watch: {
      data: function (newData) {
        var vueInstance = this;
        if (this.tableInstance) {
          this.tableInstance.clear();
          if (newData) {
            vueInstance.columns.forEach(col => {
              if (col.isCurrency) {
                newData.forEach(element => {
                  var parts = col.data.split('$');
                  vueInstance.$set(element, col.data, parseFloat(element[parts[1]]).currency());
                });
              }
            });
            this.tableInstance.rows.add(newData);
          }
          this.tableInstance.draw();
        }

        this.$nextTick(function () {
          this.registerSelectionEvent();

          this.tableInstance.on("draw", function () {
            this.registerSelectionEvent();
            this.reSetHyperLink();
          }.bind(this));

          this.reSetHyperLink();
        
        });
      },
      reSetting: function () {
        var vueInstance = this;
        if (vueInstance.reSetting) {
          vueInstance.readjust();
        }
      },
      selectedItems() {
        if (this.selectedItems.length == 0) {
          var tableID = $(this.$el).attr('id');
          var ti = this.tableInstance;
          $('#' + tableID).find(".dataSearch").each(function () {
            const col = ti.column($(this).parent().index());
            this.value = "";
            col.search("").draw();
          });
        }
      },
      columns() {
        this.initTable();
        this.binding();
      }

    },
    methods: {
      initial: function () {
        this.initTable();
        this.binding();
      },
      initTable: function () {
        var vueInstance = this;
        if (this.columns.length == 0) {
          return;
        }

        this.tableColumns = [];
        this.tableColumns = this.tableColumns.concat(this.columns);
        vueInstance.tableColumns.forEach(col => {
          if (col.isCurrency) {
            col.data = '$' + col.data;
          }
        });
        // 新增 checkbox 栏位(第一栏)
        this.tableColumns.splice(0, 0, {
          title: "",
          data: null
        });

        if (this.tableInstance) {
          this.tableInstance.destroy();
        }

        var tableID = ($(this.$el).attr('id'));
        $("#" + tableID + " thead").remove();
        $("#" + tableID + " tbody").remove();
        $("#" + tableID + " tfoot").remove();

        // 产生 footer 搜寻列
        $(this.$el).append("<tfoot><tr></tr></tfoot>");
        $(this.tableColumns).each(function () {
          $(this.$el).find("tfoot tr").append("<th rowspan='1' colspan='1'></th>");
        }.bind(this));

        // 产生 datatable 实体
        this.tableInstance = $(this.$el).dataTable({
          destroy: true,
          columns: this.tableColumns,
          data: this.data,
          processing: true,
          deferRender: true,
          columnDefs: [{
            targets: 0,
            searchable: false,
            orderable: false,
            data: null,
            render: function (data) {
              return vueInstance.isReadOnly ? "" : "<input type='checkbox' class='select' />";
            }
          }],
          order: [this.orderIndex, this.orderBy],
          language: {
            lengthMenu: "显示 _MENU_ 笔资料",
            zeroRecords: "无相符资料, 请重新查询",
            info: "第 _PAGE_ 页 / 共 _PAGES_ 页 (相符资料: 共 _TOTAL_ 项)",
            infoEmpty: "查无资料",
            infoFiltered: "(总资料: _MAX_ 项)",
            search: "搜寻",
            paginate: {
              "first": "第一页",
              "last": "最后一页",
              "next": "下一页",
              "previous": "前一页"
            }
          },
          sDom: '<"row view-filter"<"col-sm-12"<"pull-left"l><"pull-left"f><"clearfix">>>t<"row view-pager"<"col-sm-12"<"pull-left"i><"text-center"p>>>'
        }).api();

        // 产生 header 全选 checkbox
        if (!this.isReadOnly) {
          if (this.selectionMode === "multiple") {
            $(this.$el).find("thead tr th").first().append("<input class='select-all' type='checkbox' />");
          } else {
            $(this.$el).find("thead tr th").first().append("<input class='select-all' type='checkbox' disabled />");
          }
        }

        // 替换 footer 为搜寻栏位
        $(this.$el).find("tfoot th").each(function () {
          if ($(this).index() !== 0) {
            const title = $(this).text();
            $(this).html(`<input class="form-control dataSearch" type="text" placeholder="搜寻 ${title}" />`);
          }
        });

        // 将搜寻栏移动至 header 之后
        $(this.$el).find("thead").after($(this.$el).find("tfoot"));


        // 重新计算 datatable 宽度
        this.readjust();

      },
      binding: function () {
        var ti = this.tableInstance;
        var vi = this;


        // 绑定搜寻功能
        $(this.$el).find(".dataSearch").off("keyup change");
        $(this.$el).find(".dataSearch").on("keyup change", function () {
          const col = ti.column($(this).parent().index());
          if (col.search() !== this.value) {
            col.search(this.value).draw();
          }
        });

        // Table Paging功能
        var tableID = ($(vi.$el).attr('id'));
        $('#' + tableID).off('page.dt');
        $('#' + tableID).on('page.dt', function () {
          $('#' + tableID).find(".select-all").prop('checked', false);
        });

        // 绑定全选功能
        $('#' + tableID).find(".select-all").off("click");
        $('#' + tableID).find(".select-all").on("click", function () {
          // Check/uncheck all checkboxes in the table
          var selectAll = this.checked;

          $('#' + tableID).find(".select").each(function () {
            $(this).prop('checked', selectAll);
          });

          var list = [];

          $(vi.tableInstance.rows().nodes()).each(function () {
            $(this).find("td .select:checked").each(function () {
              list.push(vi.tableInstance.row($(this).parent().parent()).data());
            });
          });

          vi.$emit("change", list);
        });
      },
      // 注册 selection 事件 
      registerSelectionEvent: function () {
        var vi = this;

        var tableID = ($(vi.$el).attr('id'));
        $('#' + tableID).find('td').on('click mousedown mouseup', function (e) {
          if (e.target.type === 'checkbox') {
            e.stopPropagation();
          }
        });
        $('#' + tableID).find('.select').off('click');
        $('#' + tableID).find('.select').on('click', function () {
          var list = [];

          if (vi.selectionMode === "multiple") {
            $(vi.tableInstance.rows().nodes()).each(function () {
              $(this).find("td .select:checked").each(function () {
                list.push(vi.tableInstance.row($(this).parent().parent()).data());
              });
            });
          } else {
            if ($(this).prop('checked')) {

              $(vi.tableInstance.rows().nodes()).each(function () {
                $(this).find("td .select:checked").each(function () {
                  $(this).prop('checked', false);
                });
              });

              $(this).prop('checked', true);
              list.push(vi.tableInstance.row($(this).parent().parent()).data());
            }
          }

          vi.$emit('change', list);
        });
      },
      // 重新计算 datatable 宽度
      readjust: function () {
        this.$nextTick(function () {
          $(this.tableInstance.rows().nodes()).each(function () {
            $(this).find("td .select:checked").each(function () {
              $(this).prop('checked', false);
            });
          });

          this.tableInstance.responsive.recalc();
          this.tableInstance.columns.adjust().draw();
        });
      },
      reSetHyperLink(){
        var vueInstance = this;
           var tableID = $(this.$el).attr('id');
          if (vueInstance.linkColumn !== undefined) {
            let tmp = $.grep(vueInstance.columns, function (r) {
              return r.data === vueInstance.linkColumn;
            });
            if (tmp.length > 0) {
              var index = vueInstance.columns.indexOf(tmp[0]);
              $('#' + tableID).find("tr").each(function () {
                var td = $(this).find("td")[index+1];
                var data = vueInstance.tableInstance.row(td).data();
                if (data != undefined) {
                  $(td).html("<a href='#'>" + data[vueInstance.linkColumn] + "</a>");

                  $(this).find("a").on("click", function () {
                    vueInstance.$emit('returnLinkData', data);
                  });
                }
              });
            }
          }
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.initial();
      });
    }
  }

</script>

<style>

</style>
