	
$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
      if (o[this.name] !== undefined) {
          if (!o[this.name].push) {
              o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || '');
      } else {
          o[this.name] = this.value || '';
      }
  });
  return o;
};

/* MODEL CODE */
var AccordionModel = Backbone.Model.extend({
	defaults:{
		number: 2,
		title: 'Accordion title',
		body: 'Accordion body'
	}
});

/* ROUTER CODE */
var AccordionRouter = Backbone.Router.extend({
	routes:{
		'':'home',
		'display':'display'
	}

});

/* VIEW CODE */
var accordion = new AccordionModel();


var FormView = Backbone.View.extend({
	el:'.container',
	render: function () {
		this.$el.html($("#form-template").html());
	},
	events: {
		'submit .create-accordion': 'createAccordion',		
	},
	createAccordion: function(ev){
		
		var target = $(ev.currentTarget).serializeObject();
		
		accordion.set(target);
		
		accordionRouter.navigate('display', {trigger: true});
		return false;
		
	}
})



var AccordionView = Backbone.View.extend({
      el: '.container',
      render: function () {
      	var json = {data: accordion.toJSON()};
      	var counter = json.data.number;
      	var source   = $("#accordion-template").html();
		var template = Handlebars.compile(source);
		var html    = template(json);

		this.$el.html(html);
		for (i = 1; i < counter; i++) { 
		    this.$el.append(html);
		}
		
		var $title = $('.accordion-title');
		var $body = $('.accordion-body');
		$title.click(function(){
			$title.toggleClass('visited');
			$body.slideToggle();
		});
      }
});


var formView = new FormView({});
var accordionView = new AccordionView({});

var accordionRouter = new AccordionRouter();
accordionRouter.on('route:display', function(){
	accordionView.render();	
});
accordionRouter.on('route:home', function(){
	formView.render();
})
Backbone.history.start();





