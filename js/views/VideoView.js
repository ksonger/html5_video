/**
 * Created with JetBrains WebStorm.
 * User: KSonger
 * Date: 7/5/12
 * Time: 12:43 PM
 * To change this template use File | Settings | File Templates.
 */
window.VideoView = Backbone.View.extend({
    tagName:"div",
    selectedVideo:0,
    preselectLoaded:false,
    me:null,
    tInt:null,
    flashReady:false,
    appended:false,
    initialize:function () {
        this.template = _.template(tpl.get('video'));
        this.render();
    },
    render:function (eventName) {

        if(this.model.get("videos").length > 1 && this.model.get("config").preselected != undefined && this.model.get("config").preselected != "none" && this.model.get("config").preselected != 0 && !this.preselectLoaded)    {
            this.preselectLoaded = true;
            this.selectedVideo = this.model.get("config").preselected;
        }
        if(this.model.get("videos")[this.selectedVideo].tracking_name != undefined && this.model.get("videos")[this.selectedVideo].tracking_name != "" && !isNaN(this.model.get("videos")[this.selectedVideo].running_time))    {
            try{
                if(/msie/i.test(navigator.userAgent) && $.browser.version < 9)  {

                }   else    {
                    recordVideoLoad(this.model.get("videos")[this.selectedVideo].tracking_name);
                    recordVideoTime(0,this.model.get("videos")[this.selectedVideo].tracking_name);
                }
            }   catch(e)    {

                    //error: console.log("error calling tracking methods, functions may be missing")
            }
        }   else{
            //error: console.log("tracking name and/or running time not found")
        }

        this.$el.html(this.template({video:this.model.get("videos")[this.selectedVideo], conf:this.model.get("config")}));

        if(!this.appended)  {
            this.$el.appendTo($("#video_container"));
            this.appended = true;
        }


        if(/Firefox/i.test(navigator.userAgent))  {
            for(var i=0;i<this.model.get("mediaelement_options").features.length;i++)   {
                if(this.model.get("mediaelement_options").features[i] == "fullscreen")  {
                    this.model.get("mediaelement_options").features.splice(i, 1);
                    break;
                }
            }
        }
        var video;

        if(/msie/i.test(navigator.userAgent) && $.browser.version < 9)  {
            if(!this.flashReady) {
                this.checkFlashReady();
            }
        }   else    {
            this.me = this.$el.find('video').mediaelementplayer(this.model.get("mediaelement_options"));
            video = this.$el.find('video').get(0);
            video.addEventListener('ended', function () {
                if(app.mainView.videoView.model.get("videos").length > 1 && app.mainView.videoView.model.get("config").autoadvance == true) {
                    app.mainView.videoView.getNext();
                }
            }, false);
        }




        TweenLite.to(this.$el, .5, {css:{autoAlpha:1}});
        var v = this;
        self.clearInterval(v.tInt);
        v.tInt = self.setInterval( function() { v.timeInterval(v); }, 10000 );
        return this;
    },
    checkFlashReady:function()  {
        if(getFlashMovie("videoplayer") == null)    {
            this.render();
        }   else    {
            this.flashReady = true;
            this.render();
        }
    },
    eventClickTrigger:function()    {
        $('.mejs-overlay-button').trigger('click');
    },
    getNext:function()  {
        if(this.selectedVideo < (this.model.get("videos").length-1)) {
            this.selectedVideo++;
        }   else{
            this.selectedVideo = 0;
        }
        this.render();
        app.mainView.libraryView.$el.find(".library_item_selected").find("img").css({"border":"solid #000000 1px"});
        app.mainView.libraryView.$el.find(".library_item_selected").attr({"class":"library_item"});
        app.mainView.libraryView.preselect(this.selectedVideo);
    },
    changeVideo:function()  {
        app.mainView.videoView.render();
    },
    timeInterval:function(vv) {
        if(/msie/i.test(navigator.userAgent) && $.browser.version < 9)  {
            // do something
        }   else    {

            recordVideoTime(Math.ceil(parseInt(vv.me[0].currentTime)/10)*10,vv.model.get("videos")[this.selectedVideo].tracking_name);
        }
    }
});