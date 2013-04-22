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


//Inicialitzem l'api del calendari
var initDatePicker = function() {

    //datepicker individual
    $( ".datepicker" ).datepicker({ dateFormat: 'dd-mm-yy' });

    //datapicker per fer interval de dates
    $( ".from" ).datepicker({
        dateFormat: 'dd-mm-yy',
        defaultDate: "+1w",
        minDate: new Date(),
        changeMonth: true,
        numberOfMonths: 1,
        showOtherMonths: true,
        selectOtherMonths: true
    });
    
    $( ".to" ).datepicker({
        dateFormat: 'dd-mm-yy',
        defaultDate: "+1w",
        minDate: new Date(),
        changeMonth: true,
        numberOfMonths: 1,
        showOtherMonths: true,
        selectOtherMonths: true
    });
};

//Funcio per fer validacions de formularis
//Per poder validar un formulari hem d'afegir a la declaracio del form class="validarFormulari"
//Per poder fer validacio d'un selector d'un formulari hem d'afegir-li la classe required (class="required")
//En el cas que el formulari tingui un rang de dates i les volguem validar he d'afegir al form
var validaFormulari = function ( form ) {
    var formulari = "#"+form;
    
    //Valida tots els selectors del formulari que tenen class="required"
    $(formulari).validate();
    
    //Valida un rang de dates, afeh¡gir la classe to a la data inici i from a la data de fi
    if(($(formulari).find(".from").length != 0) && ($(formulari).find(".to").length != 0)) {
        var idDataInici = '#'+$(formulari).find(".from").attr('id');
        var idDataFi = '#'+$(formulari).find(".to").attr('id');

        $(formulari).find(".from").rules("add", {
            required: true, 
            dpDate: true,
            catalanDate: true,
            dpCompareDate: ['before', idDataFi] 
        });

        $(formulari).find(".to").rules("add", {
            required: true, 
            dpDate: true,
            catalanDate: true,
            dpCompareDate: {after: idDataInici} 
        });
    }

    //Valida un email, afegir classe email al selector i comprova que tingui @ i .com, .cat, .net, ...
    if($(formulari).find(".email").length != 0) {
        $(formulari).find(".email").rules("add", {
            email: true
        });
    }

};
