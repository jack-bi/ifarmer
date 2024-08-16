$(document).on('click', '.card-collapse', function (e) {
  $(this).parents('.el-card').find('.el-card__body').slideToggle();
});

// 修正 sidebar 無法收合/展開問題
$(document).on('click', '.nav-dropdown-toggle', function(){
  $(this).parent().toggleClass('open');
    resizeBroadcast();
});

function resizeBroadcast() {
  var timesRun = 0;
  var interval = setInterval(function(){
    timesRun += 1;
    if(timesRun === 5){
      clearInterval(interval);
    }
    window.dispatchEvent(new Event('resize'));
  }, 62.5);
}