(function ($) {
  $.fn.smsBox = function (settings) {
  var config = {
      'ui-smsbox': 'ui-smsbox',
      'ui-smsbox-head': 'ui-smsbox-head',
      'ui-smsbox-from': 'ui-smsbox-from',
      'ui-smsbox-from-head': 'head',
      'ui-smsbox-middle': 'ui-smsbox-middle',
      'ui-smsbox-to': 'ui-smsbox-to',
      'ui-smsbox-search': 'ui-smsbox-search'
    },
  data = {
    unselected : {},
    selected : {}
  },

  show = function show( ) {
    $(this).show();
  },

  hide = function hide( ) {
    $(this).hide();
  };

  function _update( updatedData, options ) {
    $("."+options['ui-smsbox-from']).html(_populateData(updatedData.unselected));
  };

  function _populateData (data) {
    var items = '';
    $.each(data,function(key,val) {
      items += "<div class='item' id='"+ key + "'>" + val + "</div>";
    });
    return items;
  }
  function _create(ele, options) {
    var unselectedItems,
    selectedItems,
    htm,
    comboBoxOptions = ele.find("option");

    if (comboBoxOptions.size()>0) {
      comboBoxOptions.each (function() {
        data.unselected[$(this).attr("value")] = $(this).text();
      });
    }
    unSelectedItems = _populateData (data.unselected);
    selectedItems = _populateData (data.selected);

    htm = " \
    <div class='"+options['ui-smsbox']+"'> \
      <div class='"+options['ui-smsbox-head']+"'> \
       <input type='text' value='' class='"+options['ui-smsbox-search']+"' /> \
        </div> \
      <div class='"+options['ui-smsbox-from']+"'> \
      <div class='"+options['ui-smsbox-from-head']+"'>From</div>  \
      "+
    unSelectedItems
    +"</div> \
      <div class='"+options['ui-smsbox-middle']+"'> \
        <input type='button' class='add-button' value='>' /> \
        <input type='button' class='remove-button' value= '<' /> \
      </div> \
      <div class='"+options['ui-smsbox-to']+"'> \
      <div class='"+options['ui-smsbox-from-head']+"'>To</div>  \
        "+selectedItems
        +
    "</div> \
    </div>";
    ele.after(htm);
    return ele.next();

   };

  function _attachEvents (elm, comboBox, options) {

    var $elm = $(elm),
    selectedItems,
    elmOptions = $elm.find("option");
    $elm.hide().addClass('combo-form-field');

    comboBox.on("click", ".item", function(){
      $(this).toggleClass('selected');
    });

    comboBox.delegate('.add-button', 'click' , function(e){
      selectedItems = comboBox.find("."+options['ui-smsbox-from']+" .item.selected").removeClass("selected");
      comboBox.find("."+options['ui-smsbox-to']).append(selectedItems );
      selectedItems.each (function() {
        var id = $(this).attr("id"),
        string = $(this).text();
        data.selected[id] = string;
        delete data.unselected[id];
        $elm.find("option[value='"+ id +"']").attr("selected",  "selected");
      });
    });

    comboBox.delegate('.remove-button', 'click', function(e){
      selectedItems = comboBox.find("."+options['ui-smsbox-to']+" .item.selected");

      comboBox.find("."+options['ui-smsbox-from']).append( selectedItems.removeClass("selected"));
      selectedItems.each (function() {
        var id = $(this).attr("id");
        data.unselected[id] = $(this).text();
        delete data.selected[id];
        $elm.find("option[value='"+ id +"']").removeAttr("selected");
      });
    });

    comboBox.delegate("."+options['ui-smsbox-search'], 'keyup' , function(e){
      _search($(this).val(), options);
    });

    return false;
  };

  function _destroy(content_elm) {

  };

  function _search(searchText, options) {
    var patt = new RegExp(searchText,'i'),
    searchedData = {
      unselected : {},
      selected : data.selected
    };
    if (searchText === "") {
      _update(data, options);
      return;
    }
    $.each(data.unselected,function(key, val) {
      if (val.search(patt) !== -1) {
        searchedData.unselected[key] = val;
      }
    });
    _update(searchedData, options);
    return;
  };

  if (settings) $.extend(config, settings);

  this.each (function() {
    //ele is the selectbox
    var ele = this,
    comboBox;

    comboBox= _create($(ele),  config);
    _attachEvents(ele, comboBox, config);
  });

  return this;

  };
})(jQuery);