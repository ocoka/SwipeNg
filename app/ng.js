/* global angular,$*/
angular.module("TestApp",["ngTouch"]).
run(["$rootScope",function($root){
  $root.yos="a";
}]).
directive("swMenu",["$http","$swipe",function menuDirFactory($http,$swipe){
  var css=".sw-menu{display:block;cursor: pointer;position: relative;padding:0;margin:0}"+
  ".sw-menu__frame{ cursor: pointer; box-sizing: border-box; width:100%; height: 100%; overflow: hidden; padding:0; margin: 0; }"+
  ".sw-menu__content {float:left;width:100%;margin:0;padding:0}"+
  ".sw-menu__left,.sw-menu__right{ box-sizing: border-box; width: 32px; height: 100%; font-size: 0; padding:0; margin: 0; }"+
  ".sw-menu__left{ float:left; text-align: right; margin-left: -32px; }"+
  ".sw-menu__right{ float:right; text-align:left; margin-right: -32px; }"+
  ".sw-menu__submenu{ box-sizing: border-box; position: absolute; bottom: 100%; right:-32px; height: 32px; background-color: rgb(224, 222, 219); padding: 2px 4px; margin: 0; border-radius: 4px; border: 1px solid rgb(197, 197, 196); box-shadow: 2px 2px 10px -2px #353535; white-space: nowrap; color: black; font-size: 0}";
  var swipeStyle=document.createElement("style");
  swipeStyle.type = 'text/css';
  if (swipeStyle.styleSheet){
    swipeStyle.styleSheet.cssText = css;
  } else {
    swipeStyle.appendChild(document.createTextNode(css));
  }
  document.head.insertBefore(swipeStyle,document.head.children[0]);

  var directiveDefinitionObject = {
      multiElement:false,
      priority: 0,
      terminal:false,
      template: '<div class="sw-menu__frame"><div class="sw-menu__content"></div></div>', // or // function(tElement, tAttrs) { ... },
      // or
      // templateUrl: 'directive.html', // or // function(tElement, tAttrs) { ... },
      transclude: {content:"swMenuContent",left:"?swMenuLeft",right:"?swMenuRight"},
      restrict: 'E',
      templateNamespace: 'html',
      scope: true,
      controller: function menuController($scope, $element, $attrs, $transclude) {
        $scope.yos="b";
      },
      controllerAs: 'ctr',
      bindToController: false,
      //require: 'siblingDirectiveName', // or // ['^parentDirectiveName', '?optionalDirectiveName', '?^optionalParent'],
      compile: function menuCompile(tElement, tAttrs, transclude) {
        tElement.addClass("sw-menu noselect");
        return {
          pre: function menuPreLink(scope, iElement, iAttrs, controller,transclude) {

          },
          post: function menuPostLink(scope, iElement, iAttrs, controller,transclude) {
            var elContent=iElement.find(".sw-menu__content");
            var elFrame=iElement.find(".sw-menu__frame");
            var elLeftBlock=null;
            var elRightBlock=null;
            var maxWidth=iAttrs.swMaxslide?parseInt(iAttrs.swMaxslide):32;
            maxWidth=maxWidth>1?maxWidth:32;
            if (transclude.isSlotFilled("left")){
              elLeftBlock=$("<div class='sw-menu__left'>");

              transclude(function(clone,scope){
                elLeftBlock.append(clone.children());
                elFrame.prepend(elLeftBlock);
              },elFrame,"left");
            }
            if (transclude.isSlotFilled("right")){
              elRightBlock=$("<div class='sw-menu__right'>");
              transclude(function(clone,scope){
                elRightBlock.append(clone.children());
                elFrame.prepend(elRightBlock);
              },elFrame,"right");
            }
            transclude(function(clone,scope){
              elContent.append(clone.children());
            },elFrame,"content");

            /*event handler's*/
            var fx=null,
              lWidth=null,
              rWidth=null;

            $swipe.bind(iElement,{
              start:function(coords){
                fx=coords.x;
                if (elLeftBlock!=null){
                    lWidth=elLeftBlock.width();
                }
                if (elRightBlock!=null){
                  rWidth=elRightBlock.width();
                }
              },
              move:function(coords){
                var mov=coords.x-fx;
                var newWidth=0;
                if (mov>0 && lWidth!=null){
                  newWidth=Math.min(lWidth+Math.abs(mov),lWidth+maxWidth);
                  elRightBlock.css("width","");
                  elLeftBlock.css("width",newWidth);
                }else if(mov<0 && rWidth!=null){
                  newWidth=Math.min(rWidth+Math.abs(mov),rWidth+maxWidth);
                  elLeftBlock.css("width","");
                  elRightBlock.css("width",newWidth);
                }
              },
              end:function(coords){

              }
            });
          }
        }
        // or
        // return function postLink( ... ) { ... }
      }
    };
    return directiveDefinitionObject;
}]).
directive("swBlock",["$http","$swipe",function swBlockFactory($http,$swipe){
  var css=".sw-block{display:block;cursor: pointer;overflow:hidden}"+
  ".sw-block__frame{ cursor: pointer; box-sizing: border-box; width:100%; height: 100%; position:relative; padding:0; margin: 0}"+
  ".sw-block__content{}"+
  ".sw-block__left,.sw-block__right{ box-sizing: border-box; height: 100%; font-size: 0; padding:0; margin: 0;white-space:nowrap;position:absolute}"+
  ".sw-block__left{ top:0;right:100% }"+
  ".sw-block__right{ top:0;left:100% }";
  var swipeStyle=document.createElement("style");
  swipeStyle.type = 'text/css';
  if (swipeStyle.styleSheet){
    swipeStyle.styleSheet.cssText = css;
  } else {
    swipeStyle.appendChild(document.createTextNode(css));
  }
  document.head.insertBefore(swipeStyle,document.head.children[0]);

  var directiveDefinitionObject = {
      multiElement:false,
      priority: 0,
      terminal:false,
      template: '<div class="sw-block__frame"><div class="sw-block__left"></div><div class="sw-block__content"></div><div class="sw-block__right"></div></div>', // or // function(tElement, tAttrs) { ... },
      // or
      // templateUrl: 'directive.html', // or // function(tElement, tAttrs) { ... },
      transclude: {content:"swBlockContent",left:"?swBlockLeft",right:"?swBlockRight"},
      restrict: 'AE',
      templateNamespace: 'html',
      scope: true,
      controller: function swBlockController($scope, $element, $attrs, $transclude) {

      },
      controllerAs: 'ctr',
      bindToController: false,
      //require: 'siblingDirectiveName', // or // ['^parentDirectiveName', '?optionalDirectiveName', '?^optionalParent'],
      compile: function swBlockCompile(tElement, tAttrs, transclude) {
        tElement.addClass("sw-block noselect");
        return {
          pre: function swBlockPreLink(scope, iElement, iAttrs, controller,transclude) {

          },
          post: function swBlockPostLink(scope, iElement, iAttrs, controller,transclude) {
            var elContent=iElement.find(".sw-block__content");
            var elFrame=iElement.find(".sw-block__frame");
            var elLeftBlock=iElement.find(".sw-block__left");
            var elRightBlock=iElement.find(".sw-block__right");
            var leftPresent=false,rightPresent=false;
            var maxWidth=iAttrs.swMaxslide?parseInt(iAttrs.swMaxslide):32;
            maxWidth=maxWidth>1?maxWidth:32;
            if (transclude.isSlotFilled("left")){
              transclude(function(clone,scope){
                elLeftBlock.append(clone.children());

              },elLeftBlock,"left");
              leftPresent=true;
            }
            if (transclude.isSlotFilled("right")){
              transclude(function(clone,scope){
                elRightBlock.append(clone.children());

              },elRightBlock,"right");
              rightPresent=true;
            }
            transclude(function(clone,scope){
              elContent.append(clone.children());
            },elContent,"content");

            /*event handler's*/
              var fx=null;
              var resize=iAttrs.swMode=="resize";
              var nextFrameLeft=null;
              var nextFrameRight=null;
              var framePos=null;
              //TODO: if left or right presnent
              $swipe.bind(iElement,{
                start:function(coords){
                  fx=coords.x;
                  framePos=parseInt(elFrame.css("left"));
                  framePos=isNaN(framePos)?0:framePos;
                  nextFrameLeft=Math.min(framePos+maxWidth,elLeftBlock.outerWidth());
                  nextFrameRight=Math.max(framePos-maxWidth,-1*elRightBlock.outerWidth());
                },
                move:function(coords){
                  var mov=coords.x-fx;
                  var pos=0;

                  if (mov>0){
                    
                    if (framePos<0 && rightPresent) {
                      pos=framePos+mov;
                      nextFrameLeft=0;
                      if (Math.abs(mov)>maxWidth/2){
                      nextFrameRight=0;
                      }else{
                      nextFrameRight=Math.max(framePos-maxWidth,-1*elRightBlock.outerWidth());
                      }
                      pos=Math.min(0,pos);
                      if (resize){
                      elFrame.css("padding-left",Math.abs(pos)+"px");
                      }
                      
                    }else if(leftPresent){
                      pos=framePos+mov;
                      if (pos>nextFrameLeft){
                        nextFrameLeft=Math.min(nextFrameLeft+maxWidth,elLeftBlock.outerWidth());
                      }
                      pos=Math.min(nextFrameLeft,pos);
                      if(resize){
                        elFrame.css("padding-left","");
                        elFrame.css("padding-right",Math.abs(pos)+"px");
                      }
                    }
                    elFrame.css("left",pos+"px");
                  }else if(mov<0){
                    
                    if (framePos>0 && leftPresent) {
                      pos=framePos+mov;
                      nextFrameRight=0;
                      if (Math.abs(mov)>maxWidth/2){
                      nextFrameLeft=0;
                      }else{
                      nextFrameLeft=Math.min(framePos+maxWidth,elLeftBlock.outerWidth());
                      }
                      pos=Math.max(0,pos);
                      if(resize){
                      elFrame.css("padding-right",Math.abs(pos)+"px");
                      }
                    }else if(leftPresent){
                      pos=framePos+mov;
                      if (pos<nextFrameRight){
                        nextFrameRight=Math.max(nextFrameRight-maxWidth,-1*elRightBlock.outerWidth());
                      }
                      pos=Math.max(nextFrameRight,pos);
                      if(resize){
                        elFrame.css("padding-right","");
                        elFrame.css("padding-left",Math.abs(pos)+"px");
                      }
                    }
                    elFrame.css("left",pos+"px");
                  }
                },
                end:function(coords){
                  
                  var mov=coords.x-fx;
                  if (mov>0){
                    
                    if (framePos<0 && rightPresent) {
                      if (resize){
                      elFrame.css("padding-left",Math.abs(nextFrameRight)+"px");
                      }
                      elFrame.css("left",nextFrameRight+"px");
                    }else if(leftPresent){
                      
                      if(resize){
                        elFrame.css("padding-left","");
                        elFrame.css("padding-right",Math.abs(nextFrameLeft)+"px");
                      }
                      elFrame.css("left",nextFrameLeft+"px");
                    }
                    
                  }else if(mov<0){
                    if (framePos>0 && leftPresent) {
                      if (resize){
                      elFrame.css("padding-right",Math.abs(nextFrameLeft)+"px");
                      }
                      elFrame.css("left",nextFrameLeft+"px");
                    }else if(rightPresent){
                      
                      if(resize){
                        elFrame.css("padding-right","");
                        elFrame.css("padding-left",Math.abs(nextFrameRight)+"px");
                      }
                      elFrame.css("left",nextFrameRight+"px");
                    }
                  }
                }
              });
            
            
          }
        }
        // or
        // return function postLink( ... ) { ... }
      }
    };
    return directiveDefinitionObject;
}]);
