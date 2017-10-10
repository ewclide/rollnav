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
            var self = this;
            this.block.element.animate({ height: this.block.minHeight}, this.speed, this.func);
            this.element.removeClass("opened");
            this.collapsed = true;
        }

        open(speed)
        {
            if (this.autoClose)
                this.block.parent.closeAll();

            this.block.element.animate({ height: this.block.maxHeight }, speed !== undefined ? speed : this.speed, this.func );
            this.element.addClass("opened");
            this.collapsed = false;
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
            var settings = {
                block : this,
                speed : options.speed || options.element.attr("data-speed"),
                opened : options.opened || options.element.attr("data-opened"),
                class : options.buttonClass || options.element.attr("data-class"),
                title : options.element.attr("data-title"),
                autoClose : options.autoClose || options.element.attr("data-auto-close")
            }

            this.element.addClass("content-wrapper");

            var wrapper = $(document.createElement("div"));
                wrapper.addClass("block-wrapper");

            options.element.after(wrapper);
            this.element.append(options.element);
            wrapper.append(this.element);


            this.maxHeight = this.element.outerHeight();

            this.element.height(0);

            this.element.css("overflow", "hidden");

            this.button = new Button(settings);

            if (settings.opened)
                this.button.open(0);
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