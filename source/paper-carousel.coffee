Polymer
	is: 'paper-carousel'

	behaviors: [
		Polymer.IronResizableBehavior
	]

	listeners: {
		'iron-resize': '_onResize'
	}

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

	_dotText: ->
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

	_isLoop: ->
		# set vars
		module = this
		value = module.getAttribute('loop')

		#set item number
		if (value != null)
			if (value == 'true')
				return true
			else
				return false
		else
			return false

	getTotalItems: ->
		# set vars
		module = this
		moduleWrapper = module.querySelector('.paper-carousel_wrapper')
		totalItems = 0

		#set item number
		if module._isLoop()
			for child in moduleWrapper.children
				if child.localName != 'template' && !child.classList.contains('cloned')
					totalItems++
		else
			for child in moduleWrapper.children
				if child.localName != 'template'
					totalItems++

		return totalItems

	_getRealTotalItems: ->
		# set vars
		module = this
		moduleWrapper = module.querySelector('.paper-carousel_wrapper')
		totalItems = 0

		#set item number
		for child in moduleWrapper.children
			if child.localName != 'template'
				totalItems++

		return totalItems

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
		module = this
		itemPortion = Math.round((100 / @getTotalItems())*1000)/1000
		itemPortion2 = Math.round((100 / @_getRealTotalItems())*1000)/1000
		item = 0

		if @_isLoop
			while item <= @_getRealTotalItems()
				if Math.round((itemPortion2 * item)*1000)/1000 == -@getContainerPosition()
					module.currentItem = item - @itemsToPrepend.length
					return item - @itemsToPrepend.length
				item++
		else
			while item <= @getTotalItems()
				if Math.round((itemPortion * item)*1000)/1000 == -@getContainerPosition()
					module.currentItem = item
					return item
				item++

	goToItem: (key) ->
		# set vars
		module = this
		moduleWrapper = module.querySelector('.paper-carousel_wrapper')
		if @_isLoop()
			itemPortion = Math.round((100 / @_getRealTotalItems())*1000)/1000
			movement = Math.round(((key + @itemsToPrepend.length) * -itemPortion)*1000)/1000
		else
			itemPortion = Math.round((100 / @getTotalItems())*1000)/1000
			movement = Math.round((key * -itemPortion)*1000)/1000

		# Apply movement
		if @_isLoop()
			moduleWrapper.style.transform = 'translateX(' + movement + '%)'
		else
			if key < @getTotalItems() && key >= 0
				if @items() < @getTotalItems()
					moduleWrapper.style.transform = 'translateX(' + movement + '%)'

		# set active dot
		@_setActiveDot(@getCurrentPage())
		@_setDisabledControls()

	goToNextItem: ->
		# set vars
		module = this
		moduleWrapper = module.querySelector('.paper-carousel_wrapper')
		itemPortion = Math.round((100 / @getTotalItems())*1000)/1000
		itemPortion2 = Math.round((100 / @_getRealTotalItems())*1000)/1000

		# Apply movement if container is not to the final position
		if @_isLoop()
			@goToItem(@getCurrentItem()+1)
			if @getCurrentItem() == @getTotalItems() + 1
				moduleWrapper.style.transition = 'none'
				@goToItem(0)
				moduleWrapper.style.transition = ''
				@goToItem(1)
		else
			if @getContainerPosition() > -(@getTotalItems()-@items()-1) * itemPortion - 5
				@goToItem(@getCurrentItem()+1)


	goToPrevItem: ->
		# set vars
		module = this
		moduleWrapper = module.querySelector('.paper-carousel_wrapper')
		itemPortion = Math.round((100 / @getTotalItems())*1000)/1000
		itemPortion2 = Math.round((100 / @_getRealTotalItems())*1000)/1000

		# Apply movement if container is not to the starting position
		if @_isLoop
			@goToItem(@getCurrentItem()-1)
			# console.log @getCurrentItem(), -@items()
			if @getCurrentItem() == undefined
				moduleWrapper.style.transition = 'none'
				@goToItem(@getTotalItems() - @items())
				console.log @getTotalItems() - @items()
				moduleWrapper.style.transition = ''
				@goToItem((@getTotalItems() - @items()) - 1)
		else
			if @getContainerPosition() < 0
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
				if !@_isLoop()
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
		itemPortion2 = Math.round((100 / @_getRealTotalItems())*1000)/1000
		pagePortionFix = (@items() - @getPages()[key].length) * itemPortion
		pagePortionFix2 = (@items() - @getPages()[key].length) * itemPortion2
		pagePortion = (-itemPortion * @items())
		pagePortion2 = (-itemPortion2 * @items())

		if @_isLoop()
			movement = (Math.round(((key * pagePortion2) + pagePortionFix2)*1000)/1000) + pagePortion2
		else
			movement = Math.round(((key * pagePortion) + pagePortionFix)*1000)/1000

		# Apply movement
		if @_isLoop()
			moduleWrapper.style.transform = 'translateX(' + movement + '%)'
		else
			if key < @getTotalPages() && key >= 0
				if @items() < @getTotalItems()
					moduleWrapper.style.transform = 'translateX(' + movement + '%)'

		# set active dot
		@_setActiveDot(key)
		@_setDisabledControls()

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

	_setContainerSize: ->
		# set vars
		module = this
		moduleWrapper = module.querySelector('.paper-carousel_wrapper')
		moduleRect = module.getBoundingClientRect()
		if @_isLoop()
			containerWidth = moduleRect.width * module._getRealTotalItems() / @items()
		else
			containerWidth = moduleRect.width * module.getTotalItems() / @items()
		childWidth = Math.round(100/@getTotalItems()*10000)/10000

		# set children width
		for child in moduleWrapper.children
			if child.localName != 'template'
				child.style.width = childWidth + '%'
		# set container width
		return moduleWrapper.style.minWidth = containerWidth + 'px'

	_setActiveDot: (key) ->
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
			if @items() < @getTotalItems()
				activeDotLine.style.transform = 'translateX(' + key + '00%)'

	_printControls: (force) ->
		# set vars
		module = this
		loopIncrement = 1

		# only print dots if has been activated
		if module.getAttribute('controls') == 'false'
			return

		# only print controls if totalPages change
		if force != true
			if module.tpages == @items()
				return

		# remove container if already exist
		if module.querySelector('.paper-carousel_controls')
			module.querySelector('.paper-carousel_controls').remove()

		# container creation
		controlsContainer = document.createElement('div')
		controlsContainer.classList.add('paper-carousel_controls')
		controlsWrapper = document.createElement('div')
		controlsWrapper.classList.add('paper-carousel_controls_wrapper')

		# Anchors creation
		nextLink = document.createElement('a')
		nextLinkIcon = document.createElement('iron-icon')
		if module.getAttribute('nextIcon') != null
			nextLinkIcon.setAttribute('icon', module.getAttribute('nextIcon'))
		else
			nextLinkIcon.setAttribute('icon', 'image:navigate-next')
		prevLink = document.createElement('a')
		prevLinkIcon = document.createElement('iron-icon')
		if module.getAttribute('prevIcon') != null
			prevLinkIcon.setAttribute('icon', module.getAttribute('prevIcon'))
		else
			prevLinkIcon.setAttribute('icon', 'image:navigate-before')
		nextLink.setAttribute('href', '')
		nextLink.classList.add('paper-carousel_controls_arrow-next')
		prevLink.setAttribute('href', '')
		prevLink.classList.add('paper-carousel_controls_arrow-prev')

		# Click anchors event
		nextLink.addEventListener 'click', (e) -> e.preventDefault()
		prevLink.addEventListener 'click', (e) -> e.preventDefault()
		module.listen nextLink, 'tap', 'goToNextItem'
		module.listen prevLink, 'tap', 'goToPrevItem'

		# parse container
		Polymer.dom(nextLink).appendChild(nextLinkIcon)
		Polymer.dom(prevLink).appendChild(prevLinkIcon)
		Polymer.dom(controlsContainer).appendChild(controlsWrapper)
		Polymer.dom(controlsWrapper).appendChild(prevLink)
		Polymer.dom(controlsWrapper).appendChild(nextLink)

		# print
		if @getTotalPages() > 1
			Polymer.dom(module.root).appendChild(controlsContainer)

		# set disabled control
		@_setDisabledControls()

	_setDisabledControls: (key) ->
		# set vars
		module = this
		itemPortion = Math.round((100 / @getTotalItems())*1000)/1000
		itemPortion2 = Math.round((100 / @_getRealTotalItems())*1000)/1000
		controlLeft = module.querySelector('.paper-carousel_controls_arrow-prev')
		controlRight = module.querySelector('.paper-carousel_controls_arrow-next')

		if @_isLoop()
			# if (controlRight != null && controlLeft != null)
			# 	# add class to disable left control
			# 	if @getContainerPosition() + (@itemsToPrepend.length * itemPortion2) > -0.5
			# 		controlLeft.classList.add('paper-carousel_controls_arrow--disabled')
			# 	else
			# 		controlLeft.classList.remove('paper-carousel_controls_arrow--disabled')

			# 	# add class to disable right control
			# 	if @getContainerPosition() + (@itemsToPrepend.length * itemPortion2) < (-(@getTotalItems()-@items()-1) * itemPortion2) - 0.5
			# 		controlRight.classList.add('paper-carousel_controls_arrow--disabled')
			# 	else
			# 		controlRight.classList.remove('paper-carousel_controls_arrow--disabled')
		else
			if (controlRight != null && controlLeft != null)
				# add class to disable left control
				if @getContainerPosition() > -0.5
					controlLeft.classList.add('paper-carousel_controls_arrow--disabled')
				else
					controlLeft.classList.remove('paper-carousel_controls_arrow--disabled')

				# add class to disable right control
				if @getContainerPosition() < -(@getTotalItems()-@items()-1) * itemPortion
					controlRight.classList.add('paper-carousel_controls_arrow--disabled')
				else
					controlRight.classList.remove('paper-carousel_controls_arrow--disabled')

	_printDots: (force) ->
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
		if force != true
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
			module.clickDotsEvent = (e) ->
				activeItem = e.target.getAttribute('data-rel')
				@goToPage(activeItem)
			dotItemLink.addEventListener 'click', (e) -> e.preventDefault()
			module.listen dotItemLink, 'tap', 'clickDotsEvent'
			# set dot text
			if @_dotText() == true
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
		@_setActiveDot(@getCurrentPage())

	_getDragState: (e) ->
		# set vars
		module = this
		moduleWrapper = module.querySelector('.paper-carousel_wrapper')
		moduleWrapperRect = moduleWrapper.getBoundingClientRect()
		movement = Math.round(((e.detail.dx*100) / moduleWrapperRect.width)*1000)/1000
		itemPortion = Math.round((100 / @getTotalItems())*1000)/1000
		maxLimit = Math.round((itemPortion*(@getTotalItems()-@items()))*1000)/1000
		endTime = 0
		touchValue = e.detail.dx

		switch e.detail.state
			when 'start'
				# set vars
				module.startTime = new Date().getTime()
				module.dragPosition = @getContainerPosition()
				window.touching = true

				# Remove transition duration
				moduleWrapper.style.transitionDuration = '0s'

				window.addEventListener 'scroll', ->
					clearInterval window.scrollingInterval
					# Set on if scroll move
					window.scrolling = true
					window.touchScroll = true

					# Set off if scrolling is end
					window.scrollingInterval = setTimeout (->
						window.scrolling = false
						if window.touching == false
							window.touchScroll = false
					), 50

			when 'track'
				# set vars
				realMovement = Math.round((module.dragPosition+movement)*1000)/1000
				realMovement = Math.min(realMovement, 0)
				realMovement = Math.max(realMovement, -maxLimit)

				if window.scrolling == false && window.touchScroll == false
					if touchValue > 30 || touchValue < -30
						# apply touch movement
						if @items() < @getTotalItems() && window.movingCarousel == true
							moduleWrapper.style.transform = 'translateX(' + realMovement + '%)'

						# Setting on if touch move
						window.movingCarousel = true

				# block the page scroll while move the carousel
				window.addEventListener 'touchmove', (e) ->
					if window.movingCarousel == true
						e.preventDefault()

			when 'end'
				# set vars
				endTime = new Date().getTime()
				swipeVelocity = endTime - module.startTime
				limitSwipeVelocity = Math.max(Math.min(swipeVelocity, 500), 100)
				itemLoop = 0

				# limit transition duration
				if @getContainerPosition() > -5
					limitSwipeVelocity = 500
				if @getContainerPosition() < -(@getTotalItems()-@items()) * itemPortion+5
					limitSwipeVelocity = 500
				if touchValue < 30 && touchValue > -30
					limitSwipeVelocity = 500

				# apply dynamic transition duration
				moduleWrapper.style.transitionDuration = limitSwipeVelocity + 'ms'

				# Reset transition duration
				module.resetTransition = () ->
					moduleWrapper.style.transitionDuration = ''
				module.listen moduleWrapper, 'transitionend', 'resetTransition'

				if window.scrolling == false && window.touchScroll == false
					if touchValue > 30 || touchValue < -30
						# adjust current item
						while itemLoop < @getTotalItems()
							startLimit = -Math.round((itemPortion*itemLoop)*1000)/1000
							endLimit = -Math.round((itemPortion*(itemLoop+1))*1000)/1000
							rangeLimit = Math.round((startLimit-endLimit)*1000)/1000
							endRangeLimit = endLimit+rangeLimit/2
							startRangeLimit = startLimit-rangeLimit/2

							if movement < 0 && swipeVelocity < 150
								if @getContainerPosition() < startLimit && @getContainerPosition() >= endLimit
									@goToItem(itemLoop+1)
							if movement > 0 && swipeVelocity < 150
								if @getContainerPosition() < startLimit && @getContainerPosition() >= endLimit
									@goToItem(itemLoop)

							if @getContainerPosition() < startLimit && @getContainerPosition() >= endRangeLimit
								@goToItem(itemLoop)
							if @getContainerPosition() < startRangeLimit && @getContainerPosition() >= endLimit
								@goToItem(itemLoop+1)
							itemLoop++

				# Setting off if touch end
				window.movingCarousel = false
				window.touchScroll = false
				window.touching = false

	_loop: ->
		# set vars
		module = this

		if module._isLoop()
			moduleWrapper = module.querySelector('.paper-carousel_wrapper')
			totalItems = 0
			module.itemsToAppend = []
			module.itemsToPrepend = []
			clonedItems = module.querySelectorAll('.paper-carousel_wrapper .cloned')

			cloneItems = ->
				childrenReverse = []

				# set items to cloning
				[].forEach.call moduleWrapper.children, (val, key) ->
					if key < module.items()
						clonedItem = val.cloneNode(true)
						clonedItem.classList.add('cloned')
						module.itemsToAppend.push clonedItem

					if key >= (module.getTotalItems() - module.items()) && key <= module.getTotalItems()
						childrenReverse.push(val)

				[].forEach.call childrenReverse, (val, key) ->
					if key < module.items()
						clonedItem = val.cloneNode(true)
						clonedItem.classList.add('cloned')
						module.itemsToPrepend.push clonedItem

			# reset cloned items
			if clonedItems.length > 0
				[].forEach.call clonedItems, (val, key) ->
					val.remove()
					if key == clonedItems.length - 1
						cloneItems()
			else
				cloneItems()

			# append cloned items
			[].forEach.call module.itemsToAppend, (val, key) ->
				moduleWrapper.appendChild val

			# prepend cloned items
			[].forEach.call module.itemsToPrepend.reverse(), (val, key) ->
				moduleWrapper.insertBefore val.cloneNode(true), moduleWrapper.children[0]

	_onDrag: ->
		# set vars
		module = this
		moduleWrapper = module.querySelector('.paper-carousel_wrapper')

		# add drag event
		module.listen(this.$$('.paper-carousel_wrapper'), 'track', '_getDragState')
		moduleWrapper.style.touchAction = ''

	_setInitialPosition: ->
		# set vars
		module = this
		moduleWrapper = module.querySelector('.paper-carousel_wrapper')

		# set carousel initial position
		moduleWrapper.style.transition = 'none'
		module.goToItem(0)
		moduleWrapper.style.transition = ''

	refresh: ->
		@_setContainerSize()
		@_printControls(true)
		@_printDots(true)
		@_onResize()

	onTransitionEnd: (things) ->
		# set vars
		module = this
		moduleWrapper = module.querySelector('.paper-carousel_wrapper')

		# add listener
		moduleWrapper.addEventListener 'transitionend', things

	ready: ->
		@itemsToAppend = []
		@itemsToPrepend = []
		@listen window, 'WebComponentsReady', '_onLoad'

	_onLoad: ->
		@_onDrag()
		@_onResize()
		@_setInitialPosition()

	_onResize: ->
		@_loop()
		@_setContainerSize()
		@_printControls()
		@_printDots()
		@goToItem(@currentItem)
