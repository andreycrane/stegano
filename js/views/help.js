define(["jquery",
        "underscore",
        "backbone"
], function ($, _, Backbone) {
    "use strict";
    
    var HelpView = Backbone.View.extend({
        id: "help_view",
        tagName: "div",
        
        initialize: function () { },
        
        render: function () {
            this.$el.append('<h1>Help view</h1>');
            
            return this;
        }
    });
    
    return HelpView;
});