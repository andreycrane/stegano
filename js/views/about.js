define(["jquery",
        "underscore",
        "backbone"
], function ($, _, Backbone) {
    "use strict";
    
    var AboutView = Backbone.View.extend({
        id: "about_view",
        tagName: "div",
        
        initialize: function () { },
        
        render: function () {
            this.$el.append('<h1>About view</h1>');
            
            return this;
        }
    });
    
    return AboutView;
});