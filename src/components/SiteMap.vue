<template>
  <div class="row">
    <div class="col-padding col-md-12">
      <el-card>
        <div class="allMap">
          <!--常態-->
          <div class="commonMap">

            <div class="commonTitleWrapper">
              <div class="commonTitle top-left-radius10 top-right-radius10">
                <div class="topWhite"></div>
                <div class="commonIcon">
                  <img src="./../../static/iFarmer/img/siteMap-01.png">
                </div>
                <div class="commonWord">
                  常態
                </div>

                <div id="clearBoth"></div>

              </div>
            </div>

            <!-- commonBox 2 -->
            <div class="commonBox bottom-left-radius5 bottom-right-radius5 marginLeftNone">

              <div class="commonTriangle"></div>

              <div class="commonBoxTitle">
                <div class="topWhite"></div>
                移欄
              </div>

              <div class="commonBoxContent">

                <router-link :to="{name: 'Home'}">
                  <div class="commonBoxLink">
                    個體移欄
                  </div>
                </router-link>

                <router-link :to="{name: 'Home'}">
                  <div class="commonBoxLink">
                    群體移出
                  </div>
                </router-link>

                <router-link :to="{name: 'Home'}">
                  <div class="commonBoxLink">
                    群體移入
                  </div>
                </router-link>

                <router-link :to="{name: 'Home'}">
                  <div class="commonBoxLink">
                    死淘作業
                  </div>
                </router-link>

              </div>

            </div>

            <!-- commonBox 3 -->
            <div class="commonBox bottom-left-radius5 bottom-right-radius5">

              <div class="commonTriangle"></div>

              <div class="commonBoxTitle">
                <div class="topWhite"></div>
                動保
              </div>

              <div class="commonBoxContent">

                <router-link :to="{name: 'Home'}">
                  <div class="commonBoxLink">
                    消毒作業
                  </div>
                </router-link>

                <router-link :to="{name: 'Home'}">
                  <div class="commonBoxLink">
                    防疫作業
                  </div>
                </router-link>

                <router-link :to="{name: 'Home'}">
                  <div class="commonBoxLink">
                    個體診斷
                  </div>
                </router-link>

                <router-link :to="{name: 'Home'}">
                  <div class="commonBoxLink">
                    群體診斷
                  </div>
                </router-link>

              </div>

            </div>

            <!-- commonBox 4 -->
            <div class="commonBox bottom-left-radius5 bottom-right-radius5">

              <div class="commonTriangle"></div>

              <div class="commonBoxTitle">
                <div class="topWhite"></div>
                餵飼
              </div>

              <div class="commonBoxContent">

                <router-link :to="{name: 'Home'}">
                  <div class="commonBoxLink">
                    個體餵飼
                  </div>
                </router-link>

                <router-link :to="{name: 'Home'}">
                  <div class="commonBoxLink">
                    群體餵飼
                  </div>
                </router-link>

                <router-link :to="{name: 'Home'}">
                  <div class="commonBoxLink">
                    餵飼計畫
                  </div>
                </router-link>

                <div class="commonBoxLink margin-bottom5">
                  &nbsp;
                </div>

              </div>

            </div>

            <!-- commonBox 5 -->
            <div class="commonBox bottom-left-radius5 bottom-right-radius5">

              <div class="commonTriangle"></div>

              <div class="commonBoxTitle">
                <div class="topWhite"></div>
                體況
              </div>

              <div class="commonBoxContent">

                <router-link :to="{name: 'Home'}">
                  <div class="commonBoxLink">
                    秤重作業
                  </div>
                </router-link>

                <router-link :to="{name: 'Home'}">
                  <div class="commonBoxLink">
                    背脂量測
                  </div>
                </router-link>

                <router-link :to="{name: 'Home'}">
                  <div class="commonBoxLink">
                    膘情作業
                  </div>
                </router-link>

                <div class="commonBoxLink margin-bottom5">
                  &nbsp;
                </div>

              </div>

            </div>

            <div id="clearBoth"></div>

          </div>

          <div v-if="siteType != 2">
            <div class="timeLine">

              <!--左欄-->
              <div class="timeLineLeft marginLeftNone">


                <div class="timeLineBox">
                  <a name="go1"></a>
                  <div class="timeLineLeftTriangle LeftTriangleColor1"></div>
                  <div class="timeLineLeftTitle siteMapBG1">
                    <div class="topWhite"></div>
                    引種
                  </div>
                  <div class="timeLineLeftBoxContent">

                    <div class="timeLineBoxLink">
                      <div class="leftL"></div>
                      <router-link :to="{name: 'Home'}">
                        <div class="timeLineBoxButton">
                          耳標補發
                        </div>
                      </router-link>
                    </div>

                    <div class="timeLineBoxLink">
                      <div class="leftL"></div>
                      <router-link :to="{name: 'Home'}">
                        <div class="timeLineBoxButton">
                          豬隻引種
                        </div>
                      </router-link>
                    </div>

                  </div>
                </div>

                <div class="timeLineBox leftMarginTop2">
                  <a name="go3"></a>
                  <div class="timeLineLeftTriangle LeftTriangleColor2"></div>
                  <div class="timeLineLeftTitle siteMapBG3">
                    <div class="topWhite"></div>
                    妊娠
                  </div>
                  <div class="timeLineLeftBoxContent">

                    <div class="timeLineBoxLink">
                      <div class="leftL"></div>
                      <router-link :to="{name: 'Home'}">
                        <div class="timeLineBoxButton">
                          妊檢作業
                        </div>
                      </router-link>
                    </div>

                    <div class="timeLineBoxLink">
                      <div class="leftL"></div>
                      <router-link :to="{name: 'Home'}">
                        <div class="timeLineBoxButton">
                          流産作業
                        </div>
                      </router-link>
                    </div>

                  </div>
                </div>

                <div class="timeLineBox leftMarginTop3">
                  <a name="go5"></a>
                  <div class="timeLineLeftTriangle LeftTriangleColor3"></div>
                  <div class="timeLineLeftTitle siteMapBG5">
                    <div class="topWhite"></div>
                    斷奶
                  </div>
                  <div class="timeLineLeftBoxContent">

                    <div class="timeLineBoxLink">
                      <div class="leftL"></div>
                      <router-link :to="{name: 'Home'}">
                        <div class="timeLineBoxButton">
                          斷奶作業
                        </div>
                      </router-link>
                    </div>

                  </div>
                </div>


              </div>

              <!--中欄-->
              <div class="timeLineCenter">

                <div class="timeLineBar1"></div>
                <div class="timeLineBar2"></div>

                <div class="timeLineCenterIcon centerMarginTop1 marginTopNone">
                  <img src="./../../static/iFarmer/img/siteMap-02.png">
                </div>

                <div class="timeLineCenterIcon centerMarginTop2">
                  <img src="./../../static/iFarmer/img/siteMap-03.png">
                </div>

                <div class="timeLineCenterIcon centerMarginTop3">
                  <img src="./../../static/iFarmer/img/siteMap-04.png">
                </div>

                <div class="timeLineCenterIcon centerMarginTop4">
                  <img src="./../../static/iFarmer/img/siteMap-05.png">
                </div>

                <div class="timeLineCenterIcon centerMarginTop5">
                  <img src="./../../static/iFarmer/img/siteMap-06.png">
                </div>


              </div>

              <!--右欄-->
              <div class="timeLineRight">

                <div class="displayPhone">
                  <div class="timeLineBox">
                    <div class="timeLineRightTriangle LeftTriangleColor1"></div>
                    <div class="timeLineRightTitle siteMapBG1">
                      <div class="topWhite"></div>
                      引種
                    </div>
                    <div class="timeLineRightBoxContent">

                      <div class="timeLineBoxLink">
                        <div class="rightL"></div>
                        <router-link :to="{name: 'Home'}">
                          <div class="timeLineBoxButton">
                            耳標補發
                          </div>
                        </router-link>
                      </div>

                      <div class="timeLineBoxLink">
                        <div class="rightL"></div>
                        <router-link :to="{name: 'Home'}">
                          <div class="timeLineBoxButton">
                            豬隻引種
                          </div>
                        </router-link>
                      </div>

                    </div>
                  </div>

                </div>

                <div class="timeLineBox">
                  <a name="go2"></a>
                  <div class="timeLineRightTriangle RightTriangleColor1"></div>
                  <div class="timeLineRightTitle siteMapBG2">
                    <div class="topWhite"></div>
                    配種
                  </div>
                  <div class="timeLineRightBoxContent">

                    <div class="timeLineBoxLink">
                      <div class="rightL"></div>
                      <router-link :to="{name: 'Home'}">
                        <div class="timeLineBoxButton">
                          查情作業
                        </div>
                      </router-link>
                    </div>

                    <div class="timeLineBoxLink">
                      <div class="rightL"></div>
                      <router-link :to="{name: 'Home'}">
                        <div class="timeLineBoxButton">
                          採精作業
                        </div>
                      </router-link>
                    </div>

                    <div class="timeLineBoxLink">
                      <div class="rightL"></div>
                      <router-link :to="{name: 'Home'}">
                        <div class="timeLineBoxButton">
                          精液檢驗
                        </div>
                      </router-link>
                    </div>

                    <div class="timeLineBoxLink">
                      <div class="rightL"></div>
                      <router-link :to="{name: 'Home'}">
                        <div class="timeLineBoxButton">
                          混精作業
                        </div>
                      </router-link>
                    </div>

                    <div class="timeLineBoxLink">
                      <div class="rightL"></div>
                      <router-link :to="{name: 'Home'}">
                        <div class="timeLineBoxButton">
                          輸精作業
                        </div>
                      </router-link>
                    </div>

                  </div>
                </div>

                <div class="displayPhone">
                  <div class="timeLineBox leftMarginTop2">
                    <div class="timeLineRightTriangle LeftTriangleColor2"></div>
                    <div class="timeLineRightTitle siteMapBG3">
                      <div class="topWhite"></div>
                      妊娠
                    </div>
                    <div class="timeLineRightBoxContent">

                      <div class="timeLineBoxLink">
                        <div class="rightL"></div>
                        <router-link :to="{name: 'Home'}">
                          <div class="timeLineBoxButton">
                            妊檢作業
                          </div>
                        </router-link>
                      </div>

                      <div class="timeLineBoxLink">
                        <div class="rightL"></div>
                        <router-link :to="{name: 'Home'}">
                          <div class="timeLineBoxButton">
                            流産作業
                          </div>
                        </router-link>
                      </div>

                    </div>
                  </div>
                </div>



                <div class="timeLineBox rightMarginTop2">
                  <a name="go4"></a>
                  <div class="timeLineRightTriangle RightTriangleColor2"></div>
                  <div class="timeLineRightTitle siteMapBG4">
                    <div class="topWhite"></div>
                    分娩
                  </div>
                  <div class="timeLineRightBoxContent">

                    <div class="timeLineBoxLink">
                      <div class="rightL"></div>
                      <router-link :to="{name: 'Home'}">
                        <div class="timeLineBoxButton">
                          分娩作業
                        </div>
                      </router-link>
                    </div>

                  </div>
                </div>


                <div class="displayPhone">
                  <div class="timeLineBox leftMarginTop3">
                    <div class="timeLineRightTriangle LeftTriangleColor3"></div>
                    <div class="timeLineRightTitle siteMapBG5">
                      <div class="topWhite"></div>
                      斷奶
                    </div>
                    <div class="timeLineRightBoxContent">

                      <div class="timeLineBoxLink">
                        <div class="rightL"></div>
                        <router-link :to="{name: 'Home'}">
                          <div class="timeLineBoxButton">
                            斷奶作業
                          </div>
                        </router-link>
                      </div>

                    </div>
                  </div>

                </div>


              </div>

              <div id="clearBoth"></div>
            </div>
          </div>

          <div v-if="siteType == 2">
            <div class="timeLineMenu">
          </div>
          </div>

        </div>

        <div class=""></div>
      </el-card>
    </div>


  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        siteID: this.$store.getters.userProfile.SiteID,
        siteType: this.$store.getters.userProfile.SiteType
      };
    },
    mounted() {}
  };

</script>
