
document.write('<script src="./js/lib/jquery.nicescroll.min.js"></script>');
document.write('<script src="./js/lib/greensock/TweenMax.js"></script>');
document.write('<script src="./js/utils.js"></script>');
document.write('<script src="./js/swfobject.js"></script>');
document.write('<script src="js/lib/mediaelement/mediaelement-and-player.js"></script>');
document.write('<link rel="stylesheet" href="./js/lib/mediaelement/mediaelementplayer.css" />');
document.write('<link rel="stylesheet" href="./css/videoplayer.css" />');
document.write('<script type="text/javascript" src="./js/models/MainModel.js"></script>');
document.write('<script type="text/javascript" src="./js/collections/MainCollection.js"></script>');
document.write('<script type="text/javascript" src="./js/views/MainView.js"></script>');
document.write('<script type="text/javascript" src="./js/views/LibraryView.js"></script>');
document.write('<script type="text/javascript" src="./js/views/VideoView.js"></script>');

Backbone.View.prototype.close = function () {
    // console.log('Closing view ' + this);
    if (this.beforeClose) {
        this.beforeClose();
    }
    this.remove();
    this.unbind();
};

var app;
var data_path;

var AppRouter = Backbone.Router.extend({
    mainView:null,
    isMSIE:false,
    isFirefox:false,
    initialize:function () {
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) || this.isTablet || this.isPhone) {
            // do something
        }
        if( /msie/i.test(navigator.userAgent)) {
            this.isMSIE = true;
        }
        if( /firefox/i.test(navigator.userAgent)) {
            this.isFirefox = true;
        }
    },
    routes:{
        "":"index"
    },
    index:function () {
        this.begin();
    },

    begin:function (callback) {
        this.lib = new MainCollection();
        this.lib.url = data_path;
        this.lib.fetch({success:function (e) {
            app.mainView = new MainView({model:app.lib.models[0]})
            if (callback) callback();
        }, error:function(e)    {
            //error: console.log(e);
        }});
    }
});

function player(args)	{
    tpl.loadTemplates([
        'main',
        'video',
        'library_left',
        'library_right',
        'library_bottom',
        'library_item'
    ], function () {
        data_path = args.json;
         app = new AppRouter();
        Backbone.history.start();
    });
    return this;
};




$(window).resize(function()   {

});







