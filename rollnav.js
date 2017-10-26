'use strict'
;(function(){

    class Button
    {
        constructor(options)
        {
            this.element = $(document.createElement("a"));
            this.collapsed = !options.opened || false;
            this.class = options.class ? "button " + options.class : "button";
            this.speed = options.speed || 250;
            this.block = options.block;
            this.title = options.title || "button";
            this.autoClose = options.autoClose || false;
            this.delay = options.delay || 0;
            this.init(options);
        }

        init (options)
        {
            var self = this;
            this.element.attr("class", this.class);
            this.element.text(this.title);
            this.element.append("<span class='label'></span>");

            this.block.element.before(this.element);

            this.element.click(function(e){
                self.toogle();
            })
        }

        close()
        {
            this.block.element.animate({ height: this.block.minHeight}, this.speed, this.func);
            this.element.removeClass("opened");
            this.collapsed = true;
        }

        open(speed)
        {
            var self = this,
                delay = speed !== undefined ? 0 : self.delay;

            setTimeout(function(){

                if (self.autoClose)
                    self.block.parent.closeAll();

                self.block.element.animate({ height: self.block.maxHeight }, speed !== undefined ? speed : self.speed, self.func );
                self.element.addClass("opened");
                self.collapsed = false;

            }, delay);
        }

        toogle()
        {
            if (this.collapsed) this.open();
            else this.close();
        }
    }

    class Block
    {
        constructor(options)
        {
            this.parent = options.parent;
            this.element = $(document.createElement("div"));
            this.minHeight = 0;
            this.maxHeight = 0;
            this.button = false;
            this.init(options);
        }

        init (options)
        {
            var self = this,
                settings = {
                    block : this,
                    speed : options.speed || options.element.attr("data-speed"),
                    opened : options.opened || options.element.attr("data-opened"),
                    class : options.buttonClass || options.element.attr("data-class"),
                    title : options.element.attr("data-title"),
                    autoClose : options.autoClose || options.element.attr("data-auto-close"),
                    delay : options.delay || options.element.attr("data-delay")
                }

            this.element.addClass("content-wrapper");

            var wrapper = $(document.createElement("div"));
                wrapper.addClass("block-wrapper");

            options.element.after(wrapper);
            this.element.append(options.element);
            wrapper.append(this.element);

            this.element.css("overflow", "hidden");

            this.button = new Button(settings);

            this.element.ready(function(e){
                self.maxHeight = self.element.outerHeight();
                self.element.height(0);
                if (settings.opened)
                    self.button.open(0);
            });
            
        }
    }

    class RollNav
    {
        constructor (options)
        {
            this.element = options.element;
            this.blocks = [];
            this.init(options);
        }

        init (options)
        {
            var blocks = this.element.find("div"),
                self = this;

            blocks.each(function(){
                var block = new Block({
                        element : $(this),
                        parent : self,
                        autoClose : options.autoClose || self.element.attr("data-auto-close")
                    });

                self.blocks.push(block);
            });
        }

        closeAll()
        {
            this.blocks.forEach(function(block){
                block.button.close();
            });
        }
    }

    $.fn.rollnav = function(options)
    {
        this.each(function(){
            if (options) options.element = $(this);
            else options = { element: $(this) }
            this.rollnav = new RollNav(options);
        });
    }

    $(document).ready(function(){
        $('.rollnav').rollnav();
    });

})();