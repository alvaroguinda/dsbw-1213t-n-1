/*$("#dataInici").datepicker({
    dateFormat: "dd-mm-yy",
    firstDay: 1,
    dayNamesMin: ["Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"],
    dayNamesShort: ["Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"],
    monthNames:
        ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol",
        "Agost", "Setembre", "Octubre", "Novembre", "Desembre"],
    monthNamesShort:
        ["Gen", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul",
        "Ago", "Set", "Oct", "Nov", "Dec"]
});*/

var initDatePicker = function() {
    //datepicker individual
    $( ".datepicker" ).datepicker({ dateFormat: 'dd-mm-yy' });

    //datapicker per fer interval de dates
    $( ".from" ).datepicker({
        dateFormat: 'dd-mm-yy',
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 3,
        onClose: function( selectedDate ) {
            $( ".to" ).datepicker( "option", "minDate", selectedDate );
        }
    });
    
    $( ".to" ).datepicker({
        dateFormat: 'dd-mm-yy',
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 3,
        onClose: function( selectedDate ) {
            $( ".from" ).datepicker( "option", "maxDate", selectedDate );
        }
    });
};

