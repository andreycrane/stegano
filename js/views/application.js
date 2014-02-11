define(["jquery",
        "underscore",
        "backbone"
], function($, _, Backbone) {
    "use strict";
    
    var ApplicationView = Backbone.View.extend({
        id: "application_view",
        tagName: "div",
        
        initalize: function () { },
        
        render: function () {
            this.$el.append('<h1>Application view</h1>');
            
            return this;
        }
    });
    
    return ApplicationView;
});
