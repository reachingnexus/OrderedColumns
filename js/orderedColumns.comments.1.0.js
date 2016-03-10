/*
Ordered Columns - With Comments
jQuery Plugin
Written by Christopher Hehn

Copyright (c) 2011  Christopher Hehn (http://reachingnexus.com)
Licensed under the MIT (http://reachingnexus.com/MIT.txt)

This plugin works on a container that has links in it. Where the links are display:block
with a defined width and float causing a columned layout. 
For example:

.linkColumns > a { float:left; width:100px; display:block; }
 - OR -
.linkColumns > a {float:left; width:50%; display:block;

<div class="linkColumns">
<a>A</a>
<a>B</a>
<a>C</a>
<a>D</a>
</div>
 
The normal flow for this markup is left to right. Ordered Columns changes the flow 
to top to bottom then left to right in equal columns. 
*/
(function ($) {
    $.fn.orderColumns = function (options) {
        //Plugin Defaults
        var defaults = {
            sort: false,
            order: 'ASC'
        }
        var options = $.extend(defaults, options);

        //Arrays for organizing the link elements 
        var elements = [];
        var newOrder = [];
        var $this = $(this);
        $.each($this, function (index, element) {
            var $element = $(element);
            //Store the width of the links container
            var containerWidth = $element.width();

            //Sample the width of a a link (this assumes all liks have the same width)
            var columnWidth = $element.children('a').width();

            //Determine how many columns will fit
            var columnCount = Math.floor(containerWidth / columnWidth);

            //Place place all links from the container in an array
            $.each($element.children('a'), function (index, value) {
                elements[index] = { 'element': value, 'name': value.text };
            });

            //If the sort option is enabled sort the elements array 
            if (options.sort) { elements = elements.sort(SortByName); }

            //Store the number of links
            var itemCount = elements.length;

            //Determine how many items will be in the longest column
            var longestColumn = Math.ceil(itemCount / columnCount);

            //Determine the maximum number of elements that will fit in the layout
            var maxGrid = longestColumn * columnCount;

            //Determine how many items will be missing from the grid
            var gridDifference = maxGrid - itemCount;

            //Determine subtract remainder from the column count so we know where
            //the columns will start getting shorter
            var remainder = columnCount - gridDifference;

            //Adjust lastFullColumnIndex for an array starting at 0
            var lastFullColumnIndex = remainder - 1;
            //alert(maxGrid+' : MG <br/>'+ gridDifference +' :GD<br/>'+ lastFullColumnIndex + ' :LFCI');

            //Calculate the newOrder
            var i = 0;
            var columnIndex = 0;
            var columnMaxIndex = columnCount - 1; //adjust for start at 0
            var rowIndex = 0;
            //Work through all elements
            while (i < itemCount) {
                var getItem = 0;
                //Find position in the grid
                if (columnIndex <= (lastFullColumnIndex + 1)) {
                    getItem = (columnIndex * longestColumn) + rowIndex;
                } else {
                    getItem = (columnIndex * (longestColumn - 1)) + rowIndex + remainder;
                }
                //Place element in its new position
                newOrder[i] = elements[getItem].element;
                //alert('writing:' +i+' : '+elements[getItem].text);
                //Move to the next position
                if (columnIndex < columnMaxIndex) {
                    columnIndex++;
                } else {
                    columnIndex = 0;
                    rowIndex++;
                }
                i++;
            }
            //Clear the columns container
            var container = $element;
            container.html(' ');
            //Fill the container with the new order
            $.each(newOrder, function (index, value) {
                container.append(value);
            });
        });
        //Sorting Rules 
        function SortByName(a, b) {
            if (a.name != null && b.name != null) {
                var nameA = a.name.toLowerCase();
                var nameB = b.name.toLowerCase();
                var ret = 0;
                if (nameA < nameB) { ret = -1 };
                if (nameA > nameB) { ret = 1 };
                if (options.order === 'DESC') { return -(ret) };
                return ret;
            }
            return 0;
        }
    }
})(jQuery);