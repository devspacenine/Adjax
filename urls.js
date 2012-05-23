(function($) {
	$.extend($ite.pages, {
		home: {
			path: '/(home/)',
		},
		
		portfolio: {
			path: '/portfolio/',
		},
		
		news: {
			path: '/news/pg_:page/)',
			args: {matchesWith: {page: /\d+/}},
			defaults: {"page": "1"}
		},
		
		about: {
			path: '/about/',
		},
		
		contact: {
			path: '/contact/'
		}
		
	});
	
	$ite.initRoutes();
	
})(jQuery);
