/**
 * Created with JetBrains WebStorm.
 * User: KSonger
 * Date: 7/5/12
 * Time: 12:43 PM
 * To change this template use File | Settings | File Templates.
 */
window.MainView = Backbone.View.extend({
    tagName:"div",
    videoView:null,
    libraryView:null,
    initialize:function () {
        this.template = _.template(tpl.get('main'));
        this.render();
    },
    render:function (eventName) {
        this.$el.html(this.template(this.model));
        this.$el.attr({"id":this.model.get("config").container});
        this.$el.appendTo("body");
        if(this.model.get("videos").length > 1) {
            this.libraryView = new LibraryView({model:app.lib.models[0]})
            this.libraryView.$el.appendTo(this.$el.find("#library_container"));
            if(this.model.get("config").preselected != undefined && this.model.get("config").preselected != "none" && this.model.get("config").preselected != 0)    {
                this.libraryView.preselect(this.model.get("config").preselected);
            }   else{
                this.libraryView.preselect(0);
            }
        }
        this.videoView = new VideoView({model:app.lib.models[0]});

        if(this.model.get("videos").length > 1 && this.model.get("config").template == "library_left")  {
            $("#"+this.model.get("config").container).find('#video_container').css({"left":this.model.get('config').librarywidth+$("#"+this.model.get("config").container).offset().left+"px"});
        }
        if(this.model.get("videos").length > 1 && this.model.get("config").template == "library_right")  {
            $("#"+this.model.get("config").container).find('#library_container').css({"left":this.model.get("videos")[this.videoView.selectedVideo].attributes.width+$("#"+this.model.get("config").container).offset().left+"px"});
        }
        if(this.model.get("videos").length > 1)  {
            this.$el.find("#library_container").niceScroll({cursorcolor:"#444444", cursorborder:"1px solid #444444", cursorwidth:"10px", cursoropacitymax:1, cursorborderradius: "6px"});
        }
        if(app.isFirefox && this.model.get("videos")[0].attributes.autoplay == true)    {
            self.setTimeout("app.mainView.videoView.eventClickTrigger()", 1000);
        }
        var pos = $('.mejs-volume-total').height()*(1-this.model.get("mediaelement_options").startVolume)
        $('.mejs-container').find(".mejs-volume-handle").css("top",pos+"px");
        $('.mejs-container').find(".mejs-volume-current").css({"top":pos+3+"px"});

        if(/msie/i.test(navigator.userAgent) && $.browser.version < 9)  {
            // do something
            //selectVideo(this.model.get("videos")[0].mp4);
        }   else    {
            $('.mejs-container').find(".mejs-volume-current").height($('.mejs-volume-total').height() - $('.mejs-container').find(".mejs-volume-handle").offset().top - 13);
            var video = this.videoView.$el.find('video').get(0);
            video.volume = this.model.get("mediaelement_options").startVolume;
        }
        return this;
    }
});
