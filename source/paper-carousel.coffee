Polymer
	is: 'paper-carousel'

	behaviors: [
		Polymer.IronScrollTargetBehavior
		Polymer.IronResizableBehavior
	]

	listeners: 'iron-resize': 'onResize'

	items: ->
		# set vars
		module = this
		moduleRect = module.getBoundingClientRect()

		if module.getAttribute('responsive') != null
			breakpoints = module.getAttribute('responsive').replace(/\s/g, '').split(',')
			breakpointKey = 0

			while breakpointKey < breakpoints.length
				# set loop vars
				breakpoint = breakpoints[breakpointKey].split(':')
				if breakpoints[breakpointKey+1]
					nextBreakpoint = breakpoints[breakpointKey+1].split(':')
				else
					nextBreakpoint = {0:0}

				# set rwd items
				if moduleRect.width <= breakpoint[0] && moduleRect.width > nextBreakpoint[0]
					return breakpoint[1]

				breakpointKey++

		# set item number
		if (module.getAttribute('items') != null)
			return module.getAttribute('items')
		else
			return 1

	dotText: ->
		# set vars
		module = this
		value = module.getAttribute('dotText')

		#set item number
		if (value != null)
			if (value == 'false')
				return false
			else
				return true
		else
			return true

	getTotalItems: ->
		# set vars
		module = this
		moduleWrapper = module.querySelector('.paper-carousel_wrapper')

		#set item number
		return moduleWrapper.children.length

	getPages: ->
		# set vars
		module = this
		item = 1
		page = []
		pages = []

		while item <= @getTotalItems()
			page.push item-1
			if item % @items() == 0
				pages.push page
				page = []
			if item == @getTotalItems()
				pages.push page
			item++

		return pages

	getTotalPages: ->
		# set vars
		module = this

		#set pages number
		return Math.ceil @getTotalItems() / @items()

	getContainerPosition: ->
		# set vars
		module = this
		moduleWrapper = module.querySelector('.paper-carousel_wrapper')
		transform = moduleWrapper.style.transform
		translateXValue = 0
		if transform != ''
			translateX = transform.match(/translateX\((.*)/)[0]
			translateXValue = translateX.match(/\((.*)\)/)[0]
			translateXValue = translateXValue.substr(1, translateXValue.length - 2)
			translateXValue = parseFloat(translateXValue)

		return translateXValue

	getCurrentItem: ->
		# set vars
		itemPortion = Math.round((100 / @getTotalItems())*1000)/1000
		item = 0

		while item <= @getTotalItems()
			if Math.round((itemPortion * item)*1000)/1000 == -@getContainerPosition()
				return item
			item++

	goToItem: (key) ->
		# set vars
		module = this
		moduleWrapper = module.querySelector('.paper-carousel_wrapper')
		itemPortion = Math.round((100 / @getTotalItems())*1000)/1000
		movement = Math.round((key * -itemPortion)*1000)/1000

		# Apply movement
		if key < @getTotalItems() && key >= 0
			moduleWrapper.style.transform = 'translateX(' + movement + '%)'

		# set active dot
		@setActiveDot(@getCurrentPage())

	goToNextItem: ->
		# set vars
		itemPortion = Math.round((100 / @getTotalItems())*1000)/1000

		# Apply movement if container is not to the final position
		if @getContainerPosition() > -(@getTotalItems()-@items()-1) * itemPortion - 5
			@goToItem(@getCurrentItem()+1)

	goToPrevItem: ->
		# set vars
		itemPortion = Math.round((100 / @getTotalItems())*1000)/1000

		# Apply movement if container is not to the starting position
		if @getContainerPosition() < -5
			@goToItem(@getCurrentItem()-1)

	getCurrentPage: ->
		# set vars
		itemPortion = Math.round((100 / @getTotalItems())*1000)/1000
		pagePortion = itemPortion * @items()
		pageKey = 0

		while pageKey < @getPages().length
			page = @getPages()[pageKey]
			lastItem = parseFloat(@getCurrentItem()) + parseFloat(@items())

			if lastItem >= @getTotalItems()
				@goToPage(@getTotalPages()-1)
				return @getTotalPages()-1
			if page.indexOf(@getCurrentItem()) != -1
				return pageKey
			pageKey++

	goToPage: (key) ->
		# set vars
		module = this
		moduleWrapper = module.querySelector('.paper-carousel_wrapper')
		itemPortion = Math.round((100 / @getTotalItems())*1000)/1000
		pagePortion = @getPages()[key].length
		movement = Math.round((key * pagePortion * -itemPortion)*1000)/1000

		# Apply movement
		if key < @getTotalPages() && key >= 0
			moduleWrapper.style.transform = 'translateX(' + movement + '%)'

		# set active dot
		@setActiveDot(key)

	goToNextPage: ->
		# set vars
		itemPortion = Math.round((100 / @getTotalItems())*1000)/1000

		# Apply movement if container is not to the final position
		if @getContainerPosition() > -(@getTotalItems()-@items()-1) * itemPortion-5
			@goToPage(@getCurrentPage()+1)

	goToPrevPage: ->
		# set vars
		itemPortion = Math.round((100 / @getTotalItems())*1000)/1000

		# Apply movement if container is not to the starting position
		if @getContainerPosition() < -5
			@goToPage(@getCurrentPage()-1)

		# set active dot
		@setActiveDot(@getCurrentPage())

	setContainerSize: ->
		# set vars
		module = this
		moduleWrapper = module.querySelector('.paper-carousel_wrapper')
		moduleRect = module.getBoundingClientRect()
		containerWidth = moduleRect.width * @getTotalItems() / @items()

		# set container width
		return moduleWrapper.style.minWidth = containerWidth + 'px'

	setActiveDot: (key) ->
		# set vars
		module = this
		activeDots = module.querySelectorAll('.paper-carousel_dot')
		activeDotLine = module.querySelector('.paper-carousel_dot-line')
		dotKey = 0

		# add class to active dot
		while dotKey < activeDots.length
			if dotKey == parseInt(key)
				activeDots[key].classList.add('active')
			else
				activeDots[dotKey].classList.remove('active')
			dotKey++

		# move active extra dot
		if activeDotLine
			activeDotLine.style.transform = 'translateX(' + key + '00%)'

	printControls: ->
		# set vars
		module = this
		loopIncrement = 1

		# only print dots if has been activated
		if module.getAttribute('controls') == 'false'
			return

		# container creation
		controlsContainer = document.createElement('div')
		controlsContainer.classList.add('paper-carousel_controls')
		controlsWrapper = document.createElement('div')
		controlsWrapper.classList.add('paper-carousel_controls_wrapper')

		# Anchors creation
		nextLink = document.createElement('a')
		nextLinkIcon = document.createElement('iron-icon')
		nextLinkIcon.setAttribute('icon', 'image:navigate-next')
		prevLink = document.createElement('a')
		prevLinkIcon = document.createElement('iron-icon')
		prevLinkIcon.setAttribute('icon', 'image:navigate-before')
		nextLink.setAttribute('href', '')
		nextLink.classList.add('paper-carousel_controls_arrow-next')
		prevLink.setAttribute('href', '')
		prevLink.classList.add('paper-carousel_controls_arrow-prev')

		# Click anchors event
		nextLink.addEventListener 'click', (e) ->
			e.preventDefault()
			module.goToNextItem()
		prevLink.addEventListener 'click', (e) ->
			e.preventDefault()
			module.goToPrevItem()

		# parse container
		Polymer.dom(nextLink).appendChild(nextLinkIcon)
		Polymer.dom(prevLink).appendChild(prevLinkIcon)
		Polymer.dom(controlsContainer).appendChild(controlsWrapper)
		Polymer.dom(controlsWrapper).appendChild(prevLink)
		Polymer.dom(controlsWrapper).appendChild(nextLink)

		# print
		if @getTotalPages() > 1
			Polymer.dom(module.root).appendChild(controlsContainer)

	printDots: ->
		# set vars
		module = this
		loopIncrement = 1

		# only print dots if has been activated
		if module.getAttribute('dots') == 'false'
			return

		# container creation
		dotsContainer = document.createElement('div')
		dotsContainer.classList.add('paper-carousel_dots')
		dotsWrapper = document.createElement('ul')
		dotsWrapper.classList.add('paper-carousel_dots_wrapper')
		# parse container
		Polymer.dom(dotsContainer).appendChild(dotsWrapper)

		# only print dots if totalPages change
		if module.tpages != @items()
			module.tpages = @items()
		else
			return

		# remove container if already exist
		if module.querySelector('.paper-carousel_dots')
			module.querySelector('.paper-carousel_dots').remove()

		# add dots into container
		while loopIncrement <= @getTotalPages()
			# dot item creation
			dotItem = document.createElement('li')
			dotItem.classList.add('paper-carousel_dot')
			# dot anchor creation
			dotItemLink = document.createElement('a')
			dotItemLink.setAttribute('href', '')
			dotItemLink.setAttribute('data-rel', loopIncrement-1)
			# dot click event
			dotItemLink.addEventListener 'click', (e) ->
				e.preventDefault()
				activeItem = @getAttribute('data-rel')
				module.goToPage(activeItem)
			# set dot text
			if @dotText() == true
				dotItemLink.textContent = loopIncrement
			# current item line creation
			dotCurrentLine = document.createElement('li')
			dotCurrentLine.classList.add('paper-carousel_dot-line')
			# parse dot
			Polymer.dom(dotItem).appendChild(dotItemLink)
			Polymer.dom(dotsWrapper).appendChild(dotItem)
			# parse current line
			if loopIncrement == @getTotalPages()
				Polymer.dom(dotsWrapper).appendChild(dotCurrentLine)
			loopIncrement++

		# print
		if @getTotalPages() > 1
			Polymer.dom(module.root).appendChild(dotsContainer)

		# set active dot
		@setActiveDot(@getCurrentPage())

	ready: ->

	attached: ->
		@printControls()

	onResize: ->
		@setContainerSize()
		@printDots()

	_scrollHandler: ->
