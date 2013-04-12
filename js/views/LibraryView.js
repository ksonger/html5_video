/**
 * Created with JetBrains WebStorm.
 * User: KSonger
 * Date: 12/11/12
 * Time: 3:22 PM
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created with JetBrains WebStorm.
 * User: KSonger
 * Date: 7/5/12
 * Time: 12:43 PM
 * To change this template use File | Settings | File Templates.
 */
window.LibraryView = Backbone.View.extend({
    tagName:"div",
    selectedItem:null,
    initialize:function () {
        this.template = _.template(tpl.get(this.model.get("config").template));
        this.render();
    },
    render:function (eventName) {
        this.$el.html(this.template({videos:this.model.get("videos"), conf:this.model.get("config")}));
        var lib = this;
        this.$el.find(".library_item").each(function() {
            $(this).click(function (e) {
                e.preventDefault();
                if(app.mainView.libraryView.selectedItem != null && app.mainView.videoView.selectedVideo != parseInt($(this).find("#item_id").val()))   {
                    $(app.mainView.libraryView.selectedItem).attr("class", "library_item");
                    $(app.mainView.libraryView.selectedItem).find("img").css({"border":"solid #000000 1px"});
                }
                if (app.mainView.videoView.selectedVideo != parseInt($(this).find("#item_id").val())) {
                    app.mainView.videoView.selectedVideo = parseInt($(this).find("#item_id").val());
                    $(this).attr("class", "library_item_selected");
                    $(this).find("img").css({"border":"solid #59c1ee 1px"});
                    TweenLite.to(app.mainView.videoView.$el, .5, {css:{autoAlpha:0}});
                    self.setTimeout(app.mainView.videoView.changeVideo, 700);
                    app.mainView.libraryView.selectedItem = this;
                }
                lib.scrollMenu($(this));
            });
            $(this).hover(
                function () {
                    if ($(this).attr("class") == "library_item") {
                        $(this).attr("class", "library_item_hover");
                    }
                },
                function () {
                    if ($(this).attr("class") == "library_item_hover") {
                        $(this).attr("class", "library_item");
                    }
                }
            );
        });
        self.setInterval(lib.updateScroll, 500);
        return this;
    },
    updateScroll:function() {
        try{
            app.mainView.$el.find("#library_container").getNiceScroll()[0].updateScrollBar();
        }   catch(e)    {

        }

    },
    preselect:function(num) {
        var lib = this;
        this.$el.find(".library_item").each(function() {
            if(num == parseInt($(this).find("#item_id").val()))  {
                $(this).attr("class", "library_item_selected");
                $(this).find("img").css({"border":"solid #59c1ee 1px"});
                lib.selectedItem = this;
                lib.scrollMenu($(this));
            }
        });
    },
    scrollMenu:function(elem)   {
        try{
            if((elem.offset().top) - $("#"+this.model.get("config").container).offset().top < 0) {
                //out of frame above the library
                var pos = (app.mainView.$el.find("#library_container").getNiceScroll()[0].getScrollTop()) + ((elem.offset().top) - $("#"+this.model.get("config").container).offset().top);
                TweenLite.to(app.mainView.$el.find("#library_container").getNiceScroll()[0],.1, {scrollTop:pos});
            }
            if(elem.offset().top + elem.height() - $("#"+this.model.get("config").container).offset().top > this.model.get("config").libraryheight) {
                //out of frame below the library
                var pos = app.mainView.$el.find("#library_container").getNiceScroll()[0].getScrollTop() + (elem.offset().top + elem.height() - $("#"+this.model.get("config").container).offset().top - this.model.get("config").libraryheight);
                TweenLite.to(app.mainView.$el.find("#library_container").getNiceScroll()[0],.1, {scrollTop:pos});
            }
        }   catch(e)    {

        }

    }
});